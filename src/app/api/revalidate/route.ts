import { NextRequest, NextResponse } from "next/server";
import { revalidateCollectionItemChange, revalidateBlogPostChange, type CollectionItemRow, type BlogPostRow } from "../../../lib/admin-revalidate";

/**
 * On-demand revalidation webhook for `collection_items`.
 *
 * `/admin` save routes already call `revalidateCollectionItem()` directly
 * (see `src/lib/admin-revalidate.ts`), so edits made through the in-house
 * editor go live immediately with no extra setup. This endpoint covers the
 * gap: any OTHER write to `collection_items` — a direct edit in the
 * Supabase table editor, a script, a future CMS integration — has no way to
 * push a revalidation signal, so those pages would otherwise only refresh
 * once the hour-long ISR window elapses and a visitor happens to re-request
 * the exact URL.
 *
 * Point a Supabase Database Webhook (Database → Webhooks) at this route for
 * INSERT/UPDATE/DELETE on `collection_items`. Supabase's default webhook
 * payload is:
 *   {
 *     "type": "INSERT" | "UPDATE" | "DELETE",
 *     "table": "collection_items",
 *     "record": { ...new row... } | null,      // null on DELETE
 *     "old_record": { ...previous row... } | null  // set on UPDATE/DELETE
 *   }
 *
 * Auth: either an `Authorization` header (`Bearer <secret>` or the bare
 * secret) or a `?secret=` query param must match `REVALIDATE_SECRET`.
 * Supabase Database Webhooks let you configure a custom HTTP header, so
 * `Authorization: Bearer <secret>` is the recommended setup; `?secret=` is
 * supported as a fallback for tooling that can't set custom headers.
 *
 * Always returns 200 on a successfully authenticated, well-formed request
 * (including for tables/events with nothing to revalidate) so Supabase
 * doesn't treat it as a failed delivery and retry.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  const providedFromHeader = authHeader?.replace(/^Bearer\s+/i, "");
  const providedFromQuery = req.nextUrl.searchParams.get("secret");
  const provided = providedFromHeader || providedFromQuery;

  if (!provided || provided !== secret) {
    return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 });
  }

  let payload: {
    type?: string;
    table?: string;
    record?: (CollectionItemRow & BlogPostRow) | null;
    old_record?: (CollectionItemRow & BlogPostRow) | null;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const supportedTables = ["collection_items", "blog_posts"];
  if (payload.table && !supportedTables.includes(payload.table)) {
    return NextResponse.json({ revalidated: false, reason: "ignored table", table: payload.table });
  }

  if (!payload.table || payload.table === "collection_items") {
    await revalidateCollectionItemChange(payload.record, payload.old_record).catch(() => {});
  }
  if (payload.table === "blog_posts") {
    revalidateBlogPostChange(payload.record, payload.old_record);
  }

  return NextResponse.json({ revalidated: true, type: payload.type, now: Date.now() });
}
