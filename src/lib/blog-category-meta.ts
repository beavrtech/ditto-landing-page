import { supabase } from "./supabase";
import { categoryName } from "./blog-listing";

/**
 * Localized display name for a blog category slug, or null if no such
 * frameworks row exists. Used by category-page metadata (the page body
 * resolves categories from the post list instead, so it can 404 empty ones).
 */
export async function getCategoryDisplayName(
  slug: string,
  locale: string
): Promise<string | null> {
  const { data } = await supabase
    .from("frameworks")
    .select("name, name_fr")
    .eq("slug", slug)
    .single();
  if (!data) return null;
  return categoryName(data, locale);
}
