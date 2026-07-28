/**
 * The industry rule, shared by the server-side filter in ./articles.ts and the
 * client-side `?industry=` filter in the article grid. It lives on its own so
 * the grid can import it without pulling in the fs-backed article loader.
 *
 * An article with no industries applies to all of them.
 */
export function matchesIndustry(industries: string[], slug: string | null | undefined): boolean {
  if (!slug) return true;
  return industries.length === 0 || industries.includes(slug);
}
