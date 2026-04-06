import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET — public: returns published news
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const category = searchParams.get("category");

  let query = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ news: data });
}

// POST — authenticated: create a news item
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("nsib_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const body = await request.json();
  const { title, excerpt, content, category, image_url, published_at } = body;

  if (!title || !excerpt) {
    return NextResponse.json({ error: "Title and excerpt are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("news")
    .insert([{
      title,
      excerpt,
      content: content || "",
      category: category || "general",
      image_url: image_url || null,
      status: "published",
      published_at: published_at || new Date().toISOString(),
      author_id: payload.userId,
      author_name: payload.email,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ news: data }, { status: 201 });
}
