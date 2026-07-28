import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  findTaxonomyPath,
  findIndustry,
  type MediaLocale,
} from "../data/taxonomy";
import { getAuthor } from "../data/authors";

const ARTICLES_DIR = path.join(process.cwd(), "content/media/articles");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  author: string;
  illustration: string;
  illustrationAlt: string;
  date: string;
  updated?: string;
  level1: string;
  level2?: string;
  level3?: string;
  industries: string[];
  draft?: boolean;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  locale: MediaLocale;
  readTimeMinutes: number;
  body: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function assertFrontmatter(data: Record<string, unknown>, file: string): ArticleFrontmatter {
  const fail = (msg: string): never => {
    throw new Error(`Invalid frontmatter in ${file}: ${msg}`);
  };
  const str = (key: string, optional = false): string | undefined => {
    const value = data[key];
    if (value === undefined || value === null || value === "") {
      if (optional) return undefined;
      fail(`missing required field "${key}"`);
    }
    if (typeof value !== "string") fail(`field "${key}" must be a string`);
    return value as string;
  };

  const fm: ArticleFrontmatter = {
    title: str("title")!,
    description: str("description")!,
    author: str("author")!,
    illustration: str("illustration")!,
    illustrationAlt: str("illustrationAlt")!,
    date: str("date")!,
    updated: str("updated", true),
    level1: str("level1")!,
    level2: str("level2", true),
    level3: str("level3", true),
    industries: Array.isArray(data.industries) ? (data.industries as string[]) : fail(`field "industries" must be a list`)!,
    draft: data.draft === true,
  };

  if (!ISO_DATE.test(fm.date)) fail(`date "${fm.date}" must be YYYY-MM-DD`);
  if (fm.updated && !ISO_DATE.test(fm.updated)) fail(`updated "${fm.updated}" must be YYYY-MM-DD`);
  const themePath = [fm.level1, fm.level2, fm.level3].filter(Boolean) as string[];
  if (!findTaxonomyPath(themePath)) fail(`unknown taxonomy path "${themePath.join("/")}" (see src/features/media/data/taxonomy.ts)`);
  if (!fm.level2) fail(`missing required field "level2" (every article needs level1 + level2)`);
  for (const industry of fm.industries) {
    if (!findIndustry(industry)) fail(`unknown industry "${industry}" (see INDUSTRIES in taxonomy.ts)`);
  }
  if (!getAuthor(fm.author)) fail(`unknown author "${fm.author}" (see src/features/media/data/authors.ts)`);
  return fm;
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
  return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

export async function getArticle(slug: string, locale: MediaLocale): Promise<Article | null> {
  const file = path.join(ARTICLES_DIR, slug, `${locale}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const fm = assertFrontmatter(data, `content/media/articles/${slug}/${locale}.mdx`);
  if (fm.draft && process.env.NODE_ENV === "production") return null;
  return {
    ...fm,
    slug,
    locale,
    readTimeMinutes: readTime(content),
    body: content,
  };
}

export async function getAllArticles(locale: MediaLocale): Promise<Article[]> {
  const slugs = await getArticleSlugs();
  const articles = await Promise.all(slugs.map((slug) => getArticle(slug, locale)));
  return (articles.filter(Boolean) as Article[]).sort((a, b) => b.date.localeCompare(a.date));
}

/** Filter by taxonomy path prefix: [l1], [l1, l2] or [l1, l2, l3]. */
export function filterByTheme(articles: Article[], themePath: string[]): Article[] {
  const [l1, l2, l3] = themePath;
  return articles.filter(
    (a) =>
      (!l1 || a.level1 === l1) &&
      (!l2 || a.level2 === l2) &&
      (!l3 || a.level3 === l3)
  );
}

export function filterByIndustry(articles: Article[], industry: string): Article[] {
  return articles.filter((a) => a.industries.includes(industry));
}

/** Related articles: same level2 first, then same level1, excluding self. */
export function relatedArticles(all: Article[], current: Article, max = 3): Article[] {
  const others = all.filter((a) => a.slug !== current.slug);
  const sameL2 = others.filter((a) => a.level1 === current.level1 && a.level2 === current.level2);
  const sameL1 = others.filter((a) => a.level1 === current.level1 && a.level2 !== current.level2);
  return [...sameL2, ...sameL1].slice(0, max);
}
