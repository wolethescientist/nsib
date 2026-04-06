import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const token = getTokenFromCookie(request.headers.get('cookie'));
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, or GIF images are allowed.' }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: 'Image too large. Maximum size is 10MB.' }, { status: 400 });

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `event-flyers/${timestamp}_${sanitizedName}`;

    const buffer = new Uint8Array(await file.arrayBuffer());
    const { data, error } = await supabase.storage
      .from('nsib')
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (error) return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage.from('nsib').getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrl, name: file.name, size: file.size });
  } catch (err) {
    console.error('Event flyer upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
