import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { findTaxonomyPath, findIndustry, type MediaLocale } from "../data/taxonomy";
import { getAuthor } from "../data/authors";

const ARTICLES_DIR = path.join(process.cwd(), "content/media/articles");
const LOCALES: MediaLocale[] = ["en", "fr"];

/**
 * One file per article holds both languages. Shared facts live in the
 * frontmatter; each language contributes a title, a description and a body.
 * Bodies are separated by a locale marker, which is an HTML comment on
 * purpose: MDX rejects HTML comments, so a marker can never collide with
 * article content.
 */
const LOCALE_MARKER = /^<!--\s*locale:(en|fr)\s*-->$/gm;
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
  /** Taxonomy path: [level1, level2] or [level1, level2, level3]. */
  section: string[];
  /** Industry slugs. Empty means the article applies to every industry. */
  industries: string[];
  draft?: boolean;
}

/** An article resolved for one language. */
export interface Article extends ArticleFrontmatter, ArticleLocaleFields {
  slug: string;
  locale: MediaLocale;
  readTimeMinutes: number;
  body: string;
}

function splitByLocale(content: string, file: string): Record<MediaLocale, string> {
  const markers = [...content.matchAll(LOCALE_MARKER)];
  if (!markers.length) {
    throw new Error(
      `Invalid article ${file}: no locale markers. Each body must be introduced by "<!-- locale:en -->" or "<!-- locale:fr -->".`
    );
  }
  const bodies = {} as Record<MediaLocale, string>;
  markers.forEach((marker, index) => {
    const locale = marker[1] as MediaLocale;
    const start = marker.index! + marker[0].length;
    const end = index + 1 < markers.length ? markers[index + 1].index! : content.length;
    bodies[locale] = content.slice(start, end).trim();
  });
  for (const locale of LOCALES) {
    if (!bodies[locale]) {
      throw new Error(`Invalid article ${file}: missing or empty "<!-- locale:${locale} -->" body.`);
    }
  }
  return bodies;
}

function assertFrontmatter(
  data: Record<string, unknown>,
  file: string,
  expectedUrl: string
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

  if (!Array.isArray(data.section) || data.section.length < 2 || data.section.length > 3) {
    fail(`field "section" must be a list of 2 or 3 taxonomy slugs: [level1, level2, level3?]`);
  }
  const section = data.section as string[];
  if (!findTaxonomyPath(section)) {
    fail(`unknown section "${section.join("/")}" (see src/features/media/data/taxonomy.ts)`);
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
  if (!getAuthor(author)) fail(`unknown author "${author}" (see src/features/media/data/authors.ts)`);

  const perLocale = {} as Record<MediaLocale, ArticleLocaleFields>;
  for (const locale of LOCALES) {
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
      industries,
      draft: data.draft === true,
    },
    perLocale,
  };
}

function readTime(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
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
  const { shared, perLocale } = assertFrontmatter(data, relative, slug);
  if (shared.draft && process.env.NODE_ENV === "production") return null;

  const body = splitByLocale(content, relative)[locale];
  return {
    ...shared,
    ...perLocale[locale],
    slug,
    locale,
    readTimeMinutes: readTime(body),
    body,
  };
}

export async function getAllArticles(locale: MediaLocale): Promise<Article[]> {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(slugs.map((slug) => getArticle(slug, locale)));
  return (articles.filter(Boolean) as Article[]).sort((a, b) => b.date.localeCompare(a.date));
}

/** Filter by taxonomy path prefix: [l1], [l1, l2] or [l1, l2, l3]. */
export function filterByTheme(articles: Article[], themePath: string[]): Article[] {
  return articles.filter((article) =>
    themePath.every((segment, index) => article.section[index] === segment)
  );
}

/** An article with no industries applies to all of them. */
export function filterByIndustry(articles: Article[], industry: string): Article[] {
  return articles.filter((a) => a.industries.length === 0 || a.industries.includes(industry));
}

/** Related articles: same level 2 first, then same level 1, excluding self. */
export function relatedArticles(all: Article[], current: Article, max = 3): Article[] {
  const others = all.filter((a) => a.slug !== current.slug);
  const sameL2 = others.filter(
    (a) => a.section[0] === current.section[0] && a.section[1] === current.section[1]
  );
  const sameL1 = others.filter(
    (a) => a.section[0] === current.section[0] && a.section[1] !== current.section[1]
  );
  return [...sameL2, ...sameL1].slice(0, max);
}
