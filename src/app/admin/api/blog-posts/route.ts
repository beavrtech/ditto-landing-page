import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase-admin";

// GET: List all blog posts
export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .select("id, name_en, slug, date_de_publication, published, author_id, category_id")
    .order("date_de_publication", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Create a new blog post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
