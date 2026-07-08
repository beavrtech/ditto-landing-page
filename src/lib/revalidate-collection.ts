import { revalidatePath } from "next/cache";

/**
 * On-demand cache invalidation for a framework's collection landing page.
 *
 * `/[locale]/collection/[framework]` is an ISR page (`revalidate = 3600`),
 * so it eventually picks up fresh CMS data on its own — but only after the
 * hour-long window elapses *and* a subsequent request lands. Because it's a
 * long-lived, frequently-visited URL (unlike a brand-new article page,
 * which has no stale prior snapshot to inherit), it can keep serving a
 * long-since-stale prerendered snapshot after a CMS edit, since nothing
 * ever proactively busts it.
 *
 * Call this right after any write that changes what a framework's landing
 * page renders (new/edited/removed `collection_items`, category
 * reordering, etc.) to force the next visit to regenerate with fresh data
 * instead of waiting on the timer. Both locale paths are always revalidated
 * since the landing page renders the same categories/order for `en`/`fr`.
 * Works for any framework — including `carbon`, which is served at the
 * friendly `/carbon` URL via a `rewrites()` entry but is rendered by the
 * same `/collection/carbon` route files, so revalidating the
 * `/collection/carbon` destination path (per Next.js's "use the
 * destination path with rewrites" rule) covers it too.
 */
export function revalidateFrameworkCollection(framework: string): void {
  revalidatePath(`/en/collection/${framework}`);
  revalidatePath(`/fr/collection/${framework}`);
}
