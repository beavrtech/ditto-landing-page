import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "./supabase-admin";
import { collectionPath } from "./localized-paths";

export type CollectionItemRow = {
  framework_id?: string | null;
  slug?: string | null;
  slug_fr?: string | null;
  also_appears_in?: string[] | null;
};

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
  row: CollectionItemRow | null | undefined
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

  // Guest listings: the item is also surfaced on every collection named in
  // `also_appears_in` (framework slugs), so those listing pages go stale too.
  for (const guestSlug of row.also_appears_in || []) {
    if (guestSlug === framework.slug) continue;
    revalidatePath(collectionPath(guestSlug, "en"));
    revalidatePath(collectionPath(guestSlug, "fr"));
  }
}

/**
 * Same as `revalidateCollectionItem`, but also covers the row's *previous*
 * state — needed for changes that don't originate from the `/admin` save
 * routes (e.g. a direct Supabase edit delivered via database webhook),
 * where a slug rename or a delete would otherwise leave the old article
 * path serving a now-orphaned stale page forever (nothing about the old
 * path changes to trigger its own ISR regeneration once the row it read is
 * gone or renamed).
 *
 * - INSERT: pass `record`, no `oldRecord` — revalidates the new paths.
 * - UPDATE: pass both — revalidates new paths, and old paths too if the
 *   slug (either locale) or the owning framework changed.
 * - DELETE: pass `oldRecord` only (`record` is null) — revalidates the
 *   deleted item's paths so it stops being served from cache.
 */
export async function revalidateCollectionItemChange(
  record: CollectionItemRow | null | undefined,
  oldRecord: CollectionItemRow | null | undefined
): Promise<void> {
  await Promise.all([
    revalidateCollectionItem(record),
    revalidateCollectionItem(oldRecord),
  ]);
}
