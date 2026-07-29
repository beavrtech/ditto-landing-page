import GithubSlugger from "github-slugger";
import type { MediaLocale } from "../data/taxonomy";

export interface TocEntry {
  id: string;
  label: string;
}

const FENCE = /```[\s\S]*?```/g;
const H2 = /^##\s+(.+?)\s*$/gm;
/** Strip the markdown a heading might carry, so the label reads as text. */
const INLINE_MARKUP = /(\*\*|__|\*|_|`)/g;

/**
 * Section list for the article rail, built from the same headings rehype-slug
 * gives ids to, using the same slugger, so the anchors always match.
 */
export function extractToc(body: string, locale: MediaLocale): TocEntry[] {
  const slugger = new GithubSlugger();
  const withoutCode = body.replace(FENCE, "");
  const entries: TocEntry[] = [];

  for (const match of withoutCode.matchAll(H2)) {
    const label = match[1].replace(INLINE_MARKUP, "").trim();
    if (label) entries.push({ id: slugger.slug(label), label });
  }

  // The FAQ heading is rendered by the component rather than written as
  // markdown, so it never passes through rehype-slug. The component gives it a
  // fixed id; mirror that here.
  if (/<FAQ[\s>]/.test(withoutCode)) {
    entries.push({ id: "faq", label: locale === "fr" ? "Questions fréquentes" : "FAQ" });
  }

  return entries;
}
