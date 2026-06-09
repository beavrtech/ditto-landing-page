import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabase-admin";
import { getTableConfig } from "../../../../../lib/admin-tables";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table: tableSlug } = await params;
  const config = getTableConfig(tableSlug);
  if (!config) return NextResponse.json({ error: "Unknown table" }, { status: 404 });

  const listKeys = config.listColumns.map((c) => c.key);
  const selectCols = ["id", ...new Set(listKeys)].join(", ");

  const { data, error } = await getSupabaseAdmin()
    .from(config.table)
    .select(selectCols)
    .order(config.orderBy.column, { ascending: config.orderBy.ascending });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table: tableSlug } = await params;
  const config = getTableConfig(tableSlug);
  if (!config) return NextResponse.json({ error: "Unknown table" }, { status: 404 });

  const body = await req.json();
  const { data, error } = await getSupabaseAdmin()
    .from(config.table)
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
