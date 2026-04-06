import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';

// GET /api/reports - list all published reports (public) or all for authed user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('reports')
    .select('id, title, type, sector, description, file_url, file_name, file_size, published_at, created_at, status, uploader_name')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Check if requester is authenticated (if so, return all; otherwise only published)
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookie(cookieHeader);
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    query = query.eq('status', 'published');
  }

  if (type) {
    query = query.eq('sector', type);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }

  return NextResponse.json({ reports: data || [], total: count });
}

// POST /api/reports - create new report record (authenticated)
export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookie(cookieHeader);
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, type, sector, description, file_url, file_name, file_size, published_at } = body;

    if (!title || !sector || !file_url) {
      return NextResponse.json({ error: 'Title, sector, and file are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        title,
        type: type || 'final',
        sector,
        description,
        file_url,
        file_name,
        file_size,
        published_at: published_at || new Date().toISOString(),
        status: 'published',
        uploaded_by: payload.userId,
        uploader_name: payload.email,
      })
      .select()
      .single();

    if (error) {
      console.error('Report insert error:', error);
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    return NextResponse.json({ report: data }, { status: 201 });
  } catch (err) {
    console.error('Report creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
