/**
 * Shared helpers for the categorized blog listing pages.
 *
 * URL scheme (mirrored in i18n/routing.ts pathnames):
 *   EN: /en/resources/blog[/category/[slug]]
 *   FR: /fr/ressources/blog[/categorie/[slug]]
 */

export type BlogCategory = {
  slug: string;
  name: string;
  count: number;
};

export function blogListPath(
  locale: string,
  opts: { category?: string | null } = {}
): string {
  const fr = locale === "fr";
  let path = fr ? "/fr/ressources/blog" : "/en/resources/blog";
  if (opts.category) path += `${fr ? "/categorie" : "/category"}/${opts.category}`;
  return path;
}

export function blogListCanonical(
  locale: string,
  opts: { category?: string | null } = {}
): string {
  return `https://www.trustditto.com${blogListPath(locale, opts)}`;
}

/** Localized display name for a category (frameworks row). */
export function categoryName(
  category: { name: string; name_fr?: string | null },
  locale: string
): string {
  return locale === "fr" && category.name_fr ? category.name_fr : category.name;
}

/**
 * Derive the category list (with post counts) from an already-fetched post
 * list. Only categories actually carrying posts get a hub page.
 */
export function categoriesFromPosts(
  posts: { category?: { slug?: string; name?: string; name_fr?: string | null } | null }[],
  locale: string
): BlogCategory[] {
  const map = new Map<string, BlogCategory>();
  for (const post of posts) {
    const cat = post.category;
    if (!cat?.slug || !cat.name) continue;
    const existing = map.get(cat.slug);
    if (existing) existing.count += 1;
    else map.set(cat.slug, { slug: cat.slug, name: categoryName(cat as { name: string; name_fr?: string | null }, locale), count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
