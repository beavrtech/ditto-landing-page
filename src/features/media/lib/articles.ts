import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { findTaxonomyPath, findIndustry, findTag, type MediaLocale } from "../data/taxonomy";
import { getAuthorSlugs } from "./authors";
import { matchesIndustry } from "./industry-filter";
import { splitByLocale, MEDIA_LOCALES } from "./locale-blocks";

const ARTICLES_DIR = path.join(process.cwd(), "content/media/articles");

/**
 * One file per article holds both languages. Shared facts live in the
 * frontmatter; each language contributes a title, a description and a body,
 * the bodies being separated by the locale markers in ./locale-blocks.
 */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** What one language contributes. */
export interface ArticleLocaleFields {
  title: string;
  description: string;
  /** Alt text for the illustration. Empty means decorative. */
  alt: string;
}

/** Facts that hold regardless of language. */
export interface ArticleFrontmatter {
  /** The slug the article is served at: /media/<url> and /fr/media/<url>. */
  url: string;
  author: string;
  illustration: string;
  date: string;
  updated?: string;
  /** Canonical taxonomy path, exactly [level1, level2]. The tree stops there. */
  section: string[];
  /**
   * Secondary placements. The article also appears on these theme pages, but
   * its breadcrumb, card kicker and primary topic stay those of `section`.
   * Entries may be shallower than `section` (a bare [level1] is allowed).
   */
  alsoIn: string[][];
  /**
   * The named frameworks, regulations and practices the article is about.
   * Flat and global: a tag is not tied to the article's theme.
   */
  tags: string[];
  /** Industry slugs. Empty means the article applies to every industry. */
  industries: string[];
  draft?: boolean;
}

const MAX_ALSO_IN = 3;
const MAX_TAGS = 5;

/** An article resolved for one language. */
export interface Article extends ArticleFrontmatter, ArticleLocaleFields {
  slug: string;
  locale: MediaLocale;
  readTimeMinutes: number;
  wordCount: number;
  body: string;
}

function assertFrontmatter(
  data: Record<string, unknown>,
  file: string,
  expectedUrl: string,
  knownAuthors: Set<string>
): { shared: ArticleFrontmatter; perLocale: Record<MediaLocale, ArticleLocaleFields> } {
  const fail = (msg: string): never => {
    throw new Error(`Invalid frontmatter in ${file}: ${msg}`);
  };
  const str = (key: string, value: unknown, optional = false): string | undefined => {
    if (value === undefined || value === null || value === "") {
      if (optional) return undefined;
      fail(`missing required field "${key}"`);
    }
    if (typeof value !== "string") fail(`field "${key}" must be a string`);
    return value as string;
  };

  const url = str("url", data.url)!;
  if (!SLUG.test(url)) fail(`url "${url}" must be a lowercase, hyphenated slug`);
  if (url !== expectedUrl) fail(`url "${url}" must match the filename "${expectedUrl}.mdx"`);

  if (!Array.isArray(data.section) || data.section.length !== 2) {
    fail(
      `field "section" must be exactly 2 taxonomy slugs: [level1, level2]. Named frameworks and regulations go in "tags"`
    );
  }
  const section = data.section as string[];
  if (!findTaxonomyPath(section)) {
    fail(`unknown section "${section.join("/")}" (see src/features/media/data/taxonomy.ts)`);
  }

  const rawAlsoIn = data.alsoIn ?? [];
  if (!Array.isArray(rawAlsoIn)) fail(`field "alsoIn" must be a list of taxonomy paths`);
  const alsoIn = rawAlsoIn as string[][];
  if (alsoIn.length > MAX_ALSO_IN) {
    fail(
      `field "alsoIn" has ${alsoIn.length} entries, at most ${MAX_ALSO_IN} are allowed (an article relevant everywhere is filed nowhere)`
    );
  }
  const seenPaths = new Set<string>();
  for (const entry of alsoIn) {
    if (!Array.isArray(entry) || entry.length < 1 || entry.length > 2) {
      fail(`each "alsoIn" entry must be a list of 1 or 2 taxonomy slugs, e.g. - [rse, climat-et-carbone]`);
    }
    if (!findTaxonomyPath(entry)) {
      fail(`unknown alsoIn section "${entry.join("/")}" (see src/features/media/data/taxonomy.ts)`);
    }
    const key = entry.join("/");
    if (seenPaths.has(key)) fail(`duplicate alsoIn section "${key}"`);
    seenPaths.add(key);
    // A secondary that sits on the primary's own branch adds nothing: theme
    // pages already match by prefix in both directions.
    const shorter = Math.min(entry.length, section.length);
    if (entry.slice(0, shorter).join("/") === section.slice(0, shorter).join("/")) {
      fail(`alsoIn section "${key}" is already covered by section "${section.join("/")}"`);
    }
  }

  const rawTags = data.tags ?? [];
  if (!Array.isArray(rawTags)) fail(`field "tags" must be a list of tag slugs (omit it for none)`);
  const tags = rawTags as string[];
  if (tags.length > MAX_TAGS) {
    fail(`field "tags" has ${tags.length} entries, at most ${MAX_TAGS} are allowed`);
  }
  const seenTags = new Set<string>();
  for (const tag of tags) {
    if (typeof tag !== "string") fail(`each "tags" entry must be a tag slug`);
    if (!findTag(tag)) fail(`unknown tag "${tag}" (see TAGS in src/features/media/data/taxonomy.ts)`);
    if (seenTags.has(tag)) fail(`duplicate tag "${tag}"`);
    seenTags.add(tag);
  }

  // Absent or empty means every industry.
  const rawIndustries = data.industries ?? [];
  if (!Array.isArray(rawIndustries)) {
    fail(`field "industries" must be a list (omit it, or leave it empty, for all industries)`);
  }
  const industries = rawIndustries as string[];
  for (const industry of industries) {
    if (!findIndustry(industry)) fail(`unknown industry "${industry}" (see INDUSTRIES in taxonomy.ts)`);
  }

  const date = str("date", data.date)!;
  if (!ISO_DATE.test(date)) fail(`date "${date}" must be YYYY-MM-DD`);
  const updated = str("updated", data.updated, true);
  if (updated && !ISO_DATE.test(updated)) fail(`updated "${updated}" must be YYYY-MM-DD`);

  const author = str("author", data.author)!;
  if (!knownAuthors.has(author)) fail(`unknown author "${author}" (see content/media/authors/)`);

  const perLocale = {} as Record<MediaLocale, ArticleLocaleFields>;
  for (const locale of MEDIA_LOCALES) {
    const block = data[locale];
    if (!block || typeof block !== "object") {
      fail(`missing "${locale}:" block with a title and a description`);
    }
    const fields = block as Record<string, unknown>;
    perLocale[locale] = {
      title: str(`${locale}.title`, fields.title)!,
      description: str(`${locale}.description`, fields.description)!,
      alt: str(`${locale}.alt`, fields.alt, true) ?? "",
    };
  }

  return {
    shared: {
      url,
      author,
      illustration: str("illustration", data.illustration)!,
      date,
      updated,
      section,
      alsoIn,
      tags,
      industries,
      draft: data.draft === true,
    },
    perLocale,
  };
}

/** Words of prose, ignoring code fences and component tags. */
function countWords(body: string): number {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export async function getArticleSlugs(): Promise<string[]> {
  const entries = await fs.readdir(ARTICLES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""))
    .sort();
}

export async function getArticle(slug: string, locale: MediaLocale): Promise<Article | null> {
  const file = path.join(ARTICLES_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
  const relative = `content/media/articles/${slug}.mdx`;
  const { data, content } = matter(raw);
  const knownAuthors = new Set(await getAuthorSlugs());
  const { shared, perLocale } = assertFrontmatter(data, relative, slug, knownAuthors);
  if (shared.draft && process.env.NODE_ENV === "production") return null;

  const body = splitByLocale(content, relative)[locale];
  const wordCount = countWords(body);
  return {
    ...shared,
    ...perLocale[locale],
    slug,
    locale,
    readTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    wordCount,
    body,
  };
}

export async function getAllArticles(locale: MediaLocale): Promise<Article[]> {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(slugs.map((slug) => getArticle(slug, locale)));
  return (articles.filter(Boolean) as Article[]).sort((a, b) => b.date.localeCompare(a.date));
}

/** Every taxonomy path an article is filed under, canonical one first. */
export function articleSections(article: Article): string[][] {
  return [article.section, ...article.alsoIn];
}

function isPrefix(prefix: string[], full: string[]): boolean {
  return prefix.length <= full.length && prefix.every((segment, i) => full[i] === segment);
}

/**
 * Filter by taxonomy path prefix: [l1], [l1, l2] or [l1, l2, l3].
 * Matches the canonical section or any secondary placement, so a theme page
 * lists both its own articles and the ones cross-filed into it.
 */
export function filterByTheme(articles: Article[], themePath: string[]): Article[] {
  return articles.filter((article) =>
    articleSections(article).some((section) => isPrefix(themePath, section))
  );
}

/** An article with no industries applies to all of them. */
export function filterByIndustry(articles: Article[], industry: string): Article[] {
  return articles.filter((a) => matchesIndustry(a.industries, industry));
}

/** Every article carrying a tag, regardless of the theme it is filed under. */
export function filterByTag(articles: Article[], tag: string): Article[] {
  return articles.filter((a) => a.tags.includes(tag));
}

/**
 * An article without its body, which is what a card needs. Grids are client
 * components so they can filter on `?industry=`; passing whole articles would
 * serialise every MDX body into the payload.
 */
export type CardArticle = Omit<Article, "body">;

export function toCards(articles: Article[]): CardArticle[] {
  return articles.map((article) => {
    const card: Partial<Article> = { ...article };
    delete card.body;
    return card as CardArticle;
  });
}

/** How many leading segments two taxonomy paths share. */
function sharedDepth(a: string[], b: string[]): number {
  let depth = 0;
  while (depth < a.length && depth < b.length && a[depth] === b[depth]) depth++;
  return depth;
}

/**
 * Related articles, closest first: the deepest taxonomy overlap wins, counting
 * secondary placements as well as canonical ones, so a cross-filed article is
 * related to both of its sections. Articles sharing nothing are excluded.
 */
export function relatedArticles(all: Article[], current: Article, max = 3): Article[] {
  const mine = articleSections(current);
  return all
    .filter((a) => a.slug !== current.slug)
    .map((article) => ({
      article,
      score: Math.max(
        ...articleSections(article).flatMap((theirs) =>
          mine.map((ours) => sharedDepth(ours, theirs))
        )
      ),
    }))
    .filter((entry) => entry.score > 0)
    // `all` arrives newest first, and sort is stable, so equal scores stay in
    // date order.
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((entry) => entry.article);
}
