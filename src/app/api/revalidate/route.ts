import { NextRequest, NextResponse } from "next/server";
import { FRAMEWORK_CONFIG } from "../../../components/ExploreArticlesSection";
import { revalidateFrameworkCollection } from "../../../lib/revalidate-collection";

/**
 * On-demand revalidation for a framework's collection landing page.
 *
 * The landing page (`/[locale]/collection/[framework]`) is served with
 * `revalidate = 3600`, so it only refreshes up to an hour after a CMS edit,
 * and only once a request happens to land after that window — it has no
 * other way to learn that content changed. Point a CMS "on publish" webhook
 * (e.g. a Supabase database webhook on `collection_items`/category-related
 * tables) at this endpoint so editors see their changes immediately instead
 * of waiting on the timer or a full redeploy.
 *
 * Usage:
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "framework": "csrd" }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET not configured" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  const provided = authHeader?.replace(/^Bearer\s+/i, "");
  if (provided !== secret) {
    return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 });
  }

  let body: { framework?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { framework } = body;
  if (!framework || !(framework in FRAMEWORK_CONFIG)) {
    return NextResponse.json(
      { error: `Unknown framework. Expected one of: ${Object.keys(FRAMEWORK_CONFIG).join(", ")}` },
      { status: 400 }
    );
  }

  revalidateFrameworkCollection(framework);

  return NextResponse.json({ revalidated: true, framework, now: Date.now() });
}
