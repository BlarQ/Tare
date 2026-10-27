import { NextRequest, NextResponse } from 'next/server';
import { getCmsDatabase, addInquiry, updateInquiryStatus } from '@/lib/cms-store';
import { isSupabaseConfigured, insertInquiryToSupabase, getSupabaseServerClient } from '@/lib/supabase';
import { isStudioAuthorized } from '@/lib/studio-auth';

export async function GET(req: NextRequest) {
  try {
    if (!isStudioAuthorized(req)) return NextResponse.json({ success: false, error: 'Studio access required.' }, { status: 401 });
    if (isSupabaseConfigured()) {
      const client = getSupabaseServerClient();
      if (client) {
        const { data, error } = await client.from('vip_inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          const formatted = data.map((i: Record<string, string | null>) => ({
            id: i.id,
            clientName: i.client_name,
            email: i.email,
            phone: i.phone,
            eventType: i.event_type,
            estimatedDate: i.estimated_date,
            location: i.location,
            guestCount: i.guest_count,
            budgetRange: i.budget_range,
            visionNotes: i.vision_notes,
            status: i.status || 'reviewing',
            createdAt: i.created_at,
          }));
          return NextResponse.json({ success: true, inquiries: formatted, source: 'supabase' });
        }
      }
    }

    const db = getCmsDatabase();
    return NextResponse.json({ success: true, inquiries: db.inquiries || [], source: 'local' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, email, phone, eventType, estimatedDate, location, guestCount, budgetRange, visionNotes } = body;

    if (!clientName || !email || !eventType) {
      return NextResponse.json({ success: false, error: 'Name, email, and event type are required.' }, { status: 400 });
    }

    const inquiryPayload = {
      clientName,
      email,
      phone: phone || '',
      eventType,
      estimatedDate: estimatedDate || 'Flexible / Unspecified',
      location: location || 'TBD',
      guestCount: guestCount || 'Not specified',
      budgetRange: budgetRange || 'Bespoke Inquiry',
      visionNotes: visionNotes || ''
    };

    // Save to local store
    const inquiry = addInquiry(inquiryPayload);

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      await insertInquiryToSupabase(inquiry);
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isStudioAuthorized(req)) return NextResponse.json({ success: false, error: 'Studio access required.' }, { status: 401 });
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Inquiry ID and status are required.' }, { status: 400 });
    }

    const inquiries = updateInquiryStatus(id, status);

    if (isSupabaseConfigured()) {
      const client = getSupabaseServerClient();
      if (client) {
        await client.from('vip_inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      }
    }

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
