import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET — public: returns upcoming/all events
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const upcoming = searchParams.get("upcoming") === "true";

  let query = supabaseAdmin
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true })
    .limit(limit);

  if (upcoming) {
    query = query.gte("event_date", new Date().toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ events: data || [] });
}

// POST — authenticated: create an event
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("nsib_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const body = await request.json();
  const { title, description, event_date, end_date, location, category, image_url, registration_link } = body;

  if (!title || !event_date) {
    return NextResponse.json({ error: "Title and event date are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("events")
    .insert([{
      title,
      description: description || "",
      event_date,
      end_date: end_date || null,
      location: location || "",
      category: category || "general",
      image_url: image_url || null,
      registration_link: registration_link || null,
      status: "published",
      created_at: new Date().toISOString(),
      organizer_name: payload.email,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data }, { status: 201 });
}

// DELETE — authenticated: delete an event
export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("nsib_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
