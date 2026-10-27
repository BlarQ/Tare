import { NextResponse } from 'next/server';
import { getCmsDatabase } from '@/lib/cms-store';
import { isSupabaseConfigured, saveCmsToSupabase } from '@/lib/supabase';

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: false,
      message: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    }, { status: 400 });
  }

  const localDb = getCmsDatabase();
  const saved = await saveCmsToSupabase(localDb);

  if (saved) {
    return NextResponse.json({
      success: true,
      message: 'Successfully synchronized all site settings, planner story, event projects, and services to Supabase Cloud Database!',
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'Failed to sync data to Supabase. Please ensure tables are created using supabase/schema.sql.',
    }, { status: 500 });
  }
}
