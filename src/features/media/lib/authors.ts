import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { splitByLocale, MEDIA_LOCALES } from "./locale-blocks";
import type { MediaLocale } from "../data/taxonomy";

const AUTHORS_DIR = path.join(process.cwd(), "content/media/authors");
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface MediaAuthor {
  slug: string;
  name: string;
  /** Job title per language. */
  title: Record<MediaLocale, string>;
  /** Biography per language, written as prose in the file body. */
  bio: Record<MediaLocale, string>;
  /** Path under /public, or an absolute URL on a host allowed in next.config.ts. */
  avatar: string;
  linkedin?: string;
  /** Bridge to the Ditto site author page at /[locale]/authors/[slug]. */
  dittoAuthorSlug?: string;
}

function parseAuthor(raw: string, expectedSlug: string): MediaAuthor {
  const file = `content/media/authors/${expectedSlug}.mdx`;
  const fail = (msg: string): never => {
    throw new Error(`Invalid author ${file}: ${msg}`);
  };
  const { data, content } = matter(raw);
  const str = (key: string, value: unknown, optional = false): string | undefined => {
    if (value === undefined || value === null || value === "") {
      if (optional) return undefined;
      fail(`missing required field "${key}"`);
    }
    if (typeof value !== "string") fail(`field "${key}" must be a string`);
    return value as string;
  };

  const slug = str("slug", data.slug)!;
  if (!SLUG.test(slug)) fail(`slug "${slug}" must be lowercase and hyphenated`);
  if (slug !== expectedSlug) fail(`slug "${slug}" must match the filename "${expectedSlug}.mdx"`);

  const bodies = splitByLocale(content, file);
  const title = {} as Record<MediaLocale, string>;
  const bio = {} as Record<MediaLocale, string>;
  for (const locale of MEDIA_LOCALES) {
    const block = data[locale];
    if (!block || typeof block !== "object") fail(`missing "${locale}:" block with a title`);
    title[locale] = str(`${locale}.title`, (block as Record<string, unknown>).title)!;
    bio[locale] = bodies[locale];
  }

  return {
    slug,
    name: str("name", data.name)!,
    title,
    bio,
    avatar: str("avatar", data.avatar)!,
    linkedin: str("linkedin", data.linkedin, true),
    dittoAuthorSlug: str("dittoAuthorSlug", data.dittoAuthorSlug, true),
  };
}

// Every article resolves its author, so the directory is read once per build
// rather than once per article. Not in development: the cache would outlive an
// edit, and someone changing a bio would see nothing change until a restart.
let cache: Promise<MediaAuthor[]> | null = null;

function loadAuthors(): Promise<MediaAuthor[]> {
  if (process.env.NODE_ENV === "development") return readAuthors();
  cache ??= readAuthors();
  return cache;
}

function readAuthors(): Promise<MediaAuthor[]> {
  return (async () => {
    const entries = await fs.readdir(AUTHORS_DIR, { withFileTypes: true });
    const files = entries.filter((e) => e.isFile() && e.name.endsWith(".mdx"));
    const authors = await Promise.all(
      files.map(async (entry) => {
        const slug = entry.name.replace(/\.mdx$/, "");
        return parseAuthor(await fs.readFile(path.join(AUTHORS_DIR, entry.name), "utf8"), slug);
      })
    );
    return authors.sort((a, b) => a.name.localeCompare(b.name));
  })();
}

export async function getAllAuthors(): Promise<MediaAuthor[]> {
  return loadAuthors();
}

export async function getAuthorSlugs(): Promise<string[]> {
  return (await loadAuthors()).map((author) => author.slug);
}

export async function getAuthor(slug: string): Promise<MediaAuthor | null> {
  return (await loadAuthors()).find((author) => author.slug === slug) ?? null;
}
