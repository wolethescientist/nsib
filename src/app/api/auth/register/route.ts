import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/auth';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'nsib_salt').digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role = 'staff' } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);

    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash, full_name, role })
      .select('id, email, full_name, role')
      .single();

    if (error) {
      console.error('Register error:', error);
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({ user, message: 'Account created successfully' });
    response.cookies.set('nsib_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
