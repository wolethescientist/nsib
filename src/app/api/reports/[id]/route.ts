import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';

// DELETE /api/reports/[id] 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookie(cookieHeader);
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Get the report first to get the file URL for storage deletion
  const { data: report } = await supabase
    .from('reports')
    .select('file_url, uploaded_by')
    .eq('id', id)
    .single();

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Only allow deletion by uploader or admin
  if (report.uploaded_by !== payload.userId && payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Delete from storage if it's a Supabase storage URL
  if (report.file_url) {
    try {
      const urlPath = report.file_url.split('/storage/v1/object/public/nsib/')[1];
      if (urlPath) {
        await supabase.storage.from('nsib').remove([urlPath]);
      }
    } catch (e) {
      console.warn('File deletion from storage failed:', e);
    }
  }

  const { error } = await supabase.from('reports').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Report deleted' });
}
