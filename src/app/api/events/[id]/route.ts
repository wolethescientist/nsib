import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: event, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Fetch related events (same category, upcoming, excluding this one)
  const { data: related } = await supabaseAdmin
    .from("events")
    .select("id, title, event_date, location, category")
    .eq("status", "published")
    .eq("category", event.category)
    .neq("id", id)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3);

  return NextResponse.json({ event, related: related || [] });
}
