import { NextRequest, NextResponse } from 'next/server';
import { accessCode, COOKIE_NAME, studioToken } from '@/lib/studio-auth';

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  if (!code || code !== accessCode()) {
    return NextResponse.json({ success: false, error: 'Invalid access code.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, studioToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
