import { NextRequest, NextResponse } from 'next/server';
import {
  getCmsDatabase,
  saveCmsDatabase,
  updateSettings,
  updateNavigation,
  updateSections,
  saveEventProject,
  deleteEventProject,
  saveService,
  deleteService,
  saveTestimonial,
  deleteTestimonial,
  resetCmsToDefault
} from '@/lib/cms-store';
import { isSupabaseConfigured, fetchCmsFromSupabase, saveCmsToSupabase } from '@/lib/supabase';
import { isStudioAuthorized } from '@/lib/studio-auth';
import { tarePortfolioContent } from '@/data/tare-portfolio';

export async function GET() {
  try {
    // If Supabase is configured, try fetching live data from Supabase first
    if (isSupabaseConfigured()) {
      const supabaseData = await fetchCmsFromSupabase();
      if (supabaseData) {
        if (!supabaseData.events.length) supabaseData.events = tarePortfolioContent.events as typeof supabaseData.events;
        if (!supabaseData.services.length) supabaseData.services = tarePortfolioContent.services as typeof supabaseData.services;
        return NextResponse.json({ success: true, data: supabaseData, source: 'supabase' });
      }
    }

    // Fallback to local store
    const data = getCmsDatabase();
    return NextResponse.json({ success: true, data, source: 'local' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isStudioAuthorized(req)) return NextResponse.json({ success: false, error: 'Studio access required.' }, { status: 401 });
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'update_settings': {
        const updated = updateSettings(payload);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'update_navigation': {
        const updated = updateNavigation(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'update_sections': {
        const updated = updateSections(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'save_event': {
        const updated = saveEventProject(payload);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'delete_event': {
        const updated = deleteEventProject(payload.id);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'save_service': {
        const updated = saveService(payload);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'delete_service': {
        const updated = deleteService(payload.id);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'save_testimonial': {
        const updated = saveTestimonial(payload);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'delete_testimonial': {
        const updated = deleteTestimonial(payload.id);
        if (isSupabaseConfigured()) {
          const current = getCmsDatabase();
          saveCmsToSupabase(current);
        }
        return NextResponse.json({ success: true, data: updated });
      }
      case 'save_all': {
        saveCmsDatabase(payload);
        if (isSupabaseConfigured()) {
          saveCmsToSupabase(payload);
        }
        return NextResponse.json({ success: true, data: payload });
      }
      case 'reset_defaults': {
        const reset = resetCmsToDefault();
        if (isSupabaseConfigured()) {
          saveCmsToSupabase(reset);
        }
        return NextResponse.json({ success: true, data: reset });
      }
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
