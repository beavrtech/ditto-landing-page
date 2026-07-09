import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "./supabase-admin";
import { collectionPath } from "./localized-paths";

/**
 * Collection article pages are ISR (`revalidate = 3600` in
 * app/[locale]/collection/[framework]/[slug]/page.tsx) with no on-demand
 * revalidation hook anywhere in this codebase. That means an admin edit
 * (e.g. filling in a previously-empty `body_en`) only reaches the public
 * site once the ISR window elapses AND a visitor happens to request that
 * exact URL again — there's no push from the CMS. For low-traffic
 * locale/article combinations that can leave stale content (including a
 * missing body) cached indefinitely, since nothing ever triggers the
 * background regeneration.
 *
 * Call this after writing to `collection_items` so saves go live
 * immediately instead of waiting on organic traffic.
 */
export async function revalidateCollectionItem(
  row: { framework_id?: string | null; slug?: string | null; slug_fr?: string | null } | null | undefined
): Promise<void> {
  if (!row?.framework_id || !row?.slug) return;

  const { data: framework } = await getSupabaseAdmin()
    .from("frameworks")
    .select("slug")
    .eq("id", row.framework_id)
    .single();
  if (!framework?.slug) return;

  // Both locales' article pages, plus both locales' framework listing pages
  // (the listing also surfaces this item via ExploreArticlesSection).
  revalidatePath(collectionPath(framework.slug, "en", row.slug));
  revalidatePath(collectionPath(framework.slug, "fr", row.slug_fr || row.slug));
  revalidatePath(collectionPath(framework.slug, "en"));
  revalidatePath(collectionPath(framework.slug, "fr"));
}
