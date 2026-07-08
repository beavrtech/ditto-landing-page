import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../../lib/supabase-admin";
import { getTableConfig } from "../../../../../../lib/admin-tables";
import { revalidateFrameworkCollection } from "../../../../../../lib/revalidate-collection";

/**
 * `collection_items` drive the `/[locale]/collection/[framework]` landing
 * pages (via `framework_id`), which are ISR-cached for an hour — editing an
 * item here wouldn't otherwise be visible until that window elapses. Best
 * effort: a lookup/revalidation failure must never block the actual save.
 */
async function revalidateCollectionItemFramework(frameworkId: unknown) {
  if (!frameworkId) return;
  try {
    const { data: fw } = await getSupabaseAdmin()
      .from("frameworks")
      .select("slug")
      .eq("id", frameworkId)
      .single();
    if (fw?.slug) revalidateFrameworkCollection(fw.slug);
  } catch {
    // Non-fatal — the page still refreshes on its own within the hour.
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table: tableSlug, id } = await params;
  const config = getTableConfig(tableSlug);
  if (!config) return NextResponse.json({ error: "Unknown table" }, { status: 404 });

  const { data, error } = await getSupabaseAdmin()
    .from(config.table)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table: tableSlug, id } = await params;
  const config = getTableConfig(tableSlug);
  if (!config) return NextResponse.json({ error: "Unknown table" }, { status: 404 });

  const body = await req.json();
  delete body.id;
  delete body.created_at;
  delete body.updated_at;

  const { data, error } = await getSupabaseAdmin()
    .from(config.table)
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (config.table === "collection_items") {
    await revalidateCollectionItemFramework((data as { framework_id?: unknown }).framework_id);
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table: tableSlug, id } = await params;
  const config = getTableConfig(tableSlug);
  if (!config) return NextResponse.json({ error: "Unknown table" }, { status: 404 });

  let frameworkId: unknown;
  if (config.table === "collection_items") {
    const { data: existing } = await getSupabaseAdmin()
      .from(config.table)
      .select("framework_id")
      .eq("id", id)
      .single();
    frameworkId = (existing as { framework_id?: unknown } | null)?.framework_id;
  }

  const { error } = await getSupabaseAdmin()
    .from(config.table)
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (config.table === "collection_items") {
    await revalidateCollectionItemFramework(frameworkId);
  }
  return NextResponse.json({ ok: true });
}
