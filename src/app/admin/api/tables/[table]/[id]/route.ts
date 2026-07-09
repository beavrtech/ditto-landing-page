import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../../lib/supabase-admin";
import { getTableConfig } from "../../../../../../lib/admin-tables";
import { revalidateCollectionItem } from "../../../../../../lib/admin-revalidate";

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

  // Push the change to the public site immediately — ISR (revalidate = 3600
  // on the collection article/listing routes) has no on-demand hook, so a
  // low-traffic page could otherwise sit stale until a visitor happens to
  // hit it again after the window elapses.
  if (tableSlug === "collection_items") {
    await revalidateCollectionItem(data).catch(() => {});
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

  const { error } = await getSupabaseAdmin()
    .from(config.table)
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
