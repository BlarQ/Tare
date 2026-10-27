import { NextResponse } from 'next/server';
import { isSupabaseConfigured, testSupabaseConnection } from '@/lib/supabase';

export async function GET() {
  const isConfigured = isSupabaseConfigured();
  if (!isConfigured) {
    return NextResponse.json({
      isConfigured: false,
      connected: false,
      message: 'Supabase credentials not configured in environment variables. Running in Local Storage Mode.',
    });
  }

  const test = await testSupabaseConnection();
  return NextResponse.json({
    isConfigured: true,
    connected: test.ok,
    message: test.message,
  });
}
