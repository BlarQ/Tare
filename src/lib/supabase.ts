import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CmsDatabase, SiteSettings, PlannerProfile, EventProject, ServicePackage, Testimonial, VIPInquiry } from '@/types/cms';
import { getCmsDatabase } from '@/lib/cms-store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Browser / Public Client
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Server / Admin Client with Service Role (if provided) or fallback to Anon
export const getSupabaseServerClient = (): SupabaseClient | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

function normalizeLegacyName<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(/\bZara\b/gi, 'Tare') as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLegacyName(item)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeLegacyName(item)])
    ) as T;
  }
  return value;
}

// Test live Supabase connectivity
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.' };
  }
  try {
    const client = getSupabaseServerClient();
    if (!client) return { ok: false, message: 'Could not create Supabase client' };
    const { error } = await client.from('site_settings').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // Table might not be created yet, but connection is alive
      return { ok: true, message: `Connected to Supabase project (${error.message || 'tables ready'})` };
    }
    return { ok: true, message: 'Successfully connected to Supabase PostgreSQL database.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `Connection error: ${msg}` };
  }
}

// Fetch complete CMS Database from Supabase tables
export async function fetchCmsFromSupabase(): Promise<CmsDatabase | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const [settingsRes, plannerRes, eventsRes, servicesRes, testimonialsRes, inquiriesRes, navRes, sectionsRes] = await Promise.all([
      client.from('site_settings').select('*').limit(1).single(),
      client.from('planner_profile').select('*').limit(1).single(),
      client.from('event_projects').select('*').order('sort_order', { ascending: true }),
      client.from('service_packages').select('*').order('sort_order', { ascending: true }),
      client.from('testimonials').select('*').order('sort_order', { ascending: true }),
      client.from('vip_inquiries').select('*').order('created_at', { ascending: false }),
      client.from('navigation_items').select('*').order('sort_order', { ascending: true }),
      client.from('sections_config').select('*').order('sort_order', { ascending: true }),
    ]);

    // If tables don't exist yet, return null to use local store fallback
    if (settingsRes.error && settingsRes.error.code !== 'PGRST116') {
      return null;
    }

    if (!settingsRes.data && !eventsRes.data) {
      return null;
    }

    const settingsData = settingsRes.data || {};
    const plannerData = plannerRes.data || {};

    const settings: SiteSettings = {
      brandName: settingsData.brand_name || 'Tare Precious',
      monogram: settingsData.monogram || 'ZO',
      tagline: settingsData.tagline || 'MASTER SCENOGRAPHER & LUXURY EVENT ARCHITECT',
      shortBio: settingsData.short_bio || '',
      location: settingsData.location || 'Victoria Island, Lagos · Abuja · London · Dubai',
      logoLight: settingsData.logo_light || '',
      logoDark: settingsData.logo_dark || '',
      themePreset: settingsData.theme_preset || 'darkroom_walnut',
      primaryColor: settingsData.primary_color || '#100904',
      secondaryColor: settingsData.secondary_color || '#ffedd7',
      accentColor: settingsData.accent_color || '#dc5000',
      canvasColor: settingsData.canvas_color || '#100904',
      fontSerif: settingsData.font_serif || 'Halyard Display',
      fontSans: settingsData.font_sans || 'Inter',
      socialLinks: settingsData.social_links || {},
      contactEmail: settingsData.contact_email || 'tareprecious5122@gmail.com',
      contactPhone: settingsData.contact_phone || '+234 9020 804 049',
      bottomBarStatusText: settingsData.bottom_bar_status_text || 'CURRENTLY ACCEPTING 2026/2027 COMMISSIONS',
      footerCopyright: settingsData.footer_copyright || '© 2026 Tare Precious. ALL RIGHTS RESERVED.',
      planner: {
        fullName: plannerData.full_name || 'Tare Precious',
        title: plannerData.title || 'Principal Event Architect & Lead Scenographer',
        tagline: plannerData.tagline || '',
        portraitImage: plannerData.portrait_image || '',
        curatorBio: plannerData.curator_bio || '',
        philosophyStatement: plannerData.philosophy_statement || '',
        signatureStyle: plannerData.signature_style || '',
        experienceYears: Number(plannerData.experience_years) || 14,
        eventsOrganized: Number(plannerData.events_organized) || 460,
        countriesWorked: Number(plannerData.countries_worked) || 11,
        satisfactionRate: plannerData.satisfaction_rate || '100% Bespoke',
        milestones: plannerData.milestones || [],
        specialties: plannerData.specialties || [],
      },
    };

    const events: EventProject[] = (eventsRes.data || []).map((e: Record<string, any>) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      subtitle: e.subtitle,
      category: e.category,
      year: e.year,
      location: e.location,
      venue: e.venue,
      guestCount: e.guest_count,
      budgetTier: e.budget_tier,
      coverImage: e.cover_image,
      inlineHeadlineImage: e.inline_headline_image,
      galleryImages: e.gallery_images || [],
      videoReelUrl: e.video_reel_url,
      description: e.description,
      deliverables: e.deliverables || [],
      vendorCredits: e.vendor_credits || [],
      clientQuote: e.client_quote,
      isFeatured: Boolean(e.is_featured),
      order: Number(e.sort_order) || 1,
    }));

    const services: ServicePackage[] = (servicesRes.data || []).map((s: Record<string, any>) => ({
      id: s.id,
      title: s.title,
      tagline: s.tagline,
      tierBadge: s.tier_badge,
      description: s.description,
      deliverables: s.deliverables || [],
      timeline: s.timeline,
      investmentTier: s.investment_tier,
      isFeatured: Boolean(s.is_featured),
      order: Number(s.sort_order) || 1,
    }));

    const testimonials: Testimonial[] = (testimonialsRes.data || []).map((t: Record<string, any>) => ({
      id: t.id,
      quote: t.quote,
      clientName: t.client_name,
      eventTitle: t.event_title,
      location: t.location,
      date: t.date,
      pressOutlet: t.press_outlet,
      pressLogoUrl: t.press_logo_url,
      isFeatured: Boolean(t.is_featured),
      order: Number(t.sort_order) || 1,
    }));

    const inquiries: VIPInquiry[] = (inquiriesRes.data || []).map((i: Record<string, any>) => ({
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

    const remoteDatabase: CmsDatabase = {
      settings,
      navigation: (navRes.data && navRes.data.length > 0) ? navRes.data : [],
      sections: (sectionsRes.data && sectionsRes.data.length > 0) ? sectionsRes.data : [],
      events,
      services,
      testimonials,
      inquiries,
    };

    // Older seeded records were created for a different portfolio identity.
    // Treat that dataset as stale so the public site and studio use the same
    // local Tare baseline until the owner saves/synchronizes the current data.
    const legacyIdentity = !/tare/i.test(
      `${settings.brandName} ${settings.planner?.fullName || ''}`
    );
    if (legacyIdentity) {
      return getCmsDatabase();
    }

    return normalizeLegacyName(remoteDatabase);
  } catch (error) {
    console.warn('Could not fetch CMS data from Supabase:', error);
    return null;
  }
}

// Save complete CMS Database to Supabase tables
export async function saveCmsToSupabase(db: CmsDatabase): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const { settings, events, services, testimonials, navigation, sections } = db;
    const { planner } = settings;

    // 1. Upsert Site Settings
    await client.from('site_settings').upsert({
      id: 'default_settings',
      brand_name: settings.brandName,
      monogram: settings.monogram,
      tagline: settings.tagline,
      short_bio: settings.shortBio,
      location: settings.location,
      logo_light: settings.logoLight,
      logo_dark: settings.logoDark,
      theme_preset: settings.themePreset,
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      accent_color: settings.accentColor,
      canvas_color: settings.canvasColor,
      font_serif: settings.fontSerif,
      font_sans: settings.fontSans,
      social_links: settings.socialLinks,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      bottom_bar_status_text: settings.bottomBarStatusText,
      footer_copyright: settings.footerCopyright,
      updated_at: new Date().toISOString(),
    });

    // 2. Upsert Planner Profile
    if (planner) {
      await client.from('planner_profile').upsert({
        id: 'default_planner',
        full_name: planner.fullName,
        title: planner.title,
        tagline: planner.tagline,
        portrait_image: planner.portraitImage,
        curator_bio: planner.curatorBio,
        philosophy_statement: planner.philosophyStatement,
        signature_style: planner.signatureStyle,
        experience_years: planner.experienceYears,
        events_organized: planner.eventsOrganized,
        countries_worked: planner.countriesWorked,
        satisfaction_rate: planner.satisfactionRate,
        milestones: planner.milestones,
        specialties: planner.specialties,
        updated_at: new Date().toISOString(),
      });
    }

    // 3. Sync Events / Gallery Folders
    // Remove cloud rows no longer present locally so CMS deletions stay deleted.
    const eventIds = (events || []).map((event) => event.id).filter(Boolean);
    const eventDeleteQuery = eventIds.length > 0
      ? client.from('event_projects').delete().not('id', 'in', `(${eventIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(',')})`)
      : client.from('event_projects').delete().neq('id', '');
    const { error: eventDeleteError } = await eventDeleteQuery;
    if (eventDeleteError) throw eventDeleteError;

    if (events && events.length > 0) {
      const formattedEvents = events.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        subtitle: e.subtitle,
        category: e.category,
        year: e.year,
        location: e.location,
        venue: e.venue,
        guest_count: e.guestCount,
        budget_tier: e.budgetTier,
        cover_image: e.coverImage,
        inline_headline_image: e.inlineHeadlineImage,
        gallery_images: e.galleryImages,
        video_reel_url: e.videoReelUrl,
        description: e.description,
        deliverables: e.deliverables,
        vendor_credits: e.vendorCredits,
        client_quote: e.clientQuote,
        is_featured: e.isFeatured,
        sort_order: e.order,
        updated_at: new Date().toISOString(),
      }));
      const { error: eventUpsertError } = await client.from('event_projects').upsert(formattedEvents);
      if (eventUpsertError) throw eventUpsertError;
    }

    // 4. Sync Services
    const serviceIds = (services || []).map((service) => service.id).filter(Boolean);
    const serviceDeleteQuery = serviceIds.length > 0
      ? client.from('service_packages').delete().not('id', 'in', `(${serviceIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(',')})`)
      : client.from('service_packages').delete().neq('id', '');
    const { error: serviceDeleteError } = await serviceDeleteQuery;
    if (serviceDeleteError) throw serviceDeleteError;

    if (services && services.length > 0) {
      const formattedServices = services.map((s) => ({
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        tier_badge: s.tierBadge,
        description: s.description,
        deliverables: s.deliverables,
        timeline: s.timeline,
        investment_tier: s.investmentTier,
        is_featured: s.isFeatured,
        sort_order: s.order,
        updated_at: new Date().toISOString(),
      }));
      const { error: serviceUpsertError } = await client.from('service_packages').upsert(formattedServices);
      if (serviceUpsertError) throw serviceUpsertError;
    }

    // 5. Sync Testimonials / Feedbacks
    // Remove cloud rows no longer present locally so CMS deletions stay deleted.
    const testimonialIds = (testimonials || []).map((testimonial) => testimonial.id).filter(Boolean);
    const testimonialDeleteQuery = testimonialIds.length > 0
      ? client.from('testimonials').delete().not('id', 'in', `(${testimonialIds.map((id) => `"${id.replace(/"/g, '\\"')}"`).join(',')})`)
      : client.from('testimonials').delete().neq('id', '');
    const { error: testimonialDeleteError } = await testimonialDeleteQuery;
    if (testimonialDeleteError) throw testimonialDeleteError;

    if (testimonials && testimonials.length > 0) {
      const formattedTestimonials = testimonials.map((t) => ({
        id: t.id,
        quote: t.quote,
        client_name: t.clientName,
        event_title: t.eventTitle,
        location: t.location,
        date: t.date,
        press_outlet: t.pressOutlet,
        press_logo_url: t.pressLogoUrl,
        is_featured: t.isFeatured,
        sort_order: t.order,
      }));
      const { error: testimonialUpsertError } = await client.from('testimonials').upsert(formattedTestimonials);
      if (testimonialUpsertError) throw testimonialUpsertError;
    }

    return true;
  } catch (error) {
    console.error('Error saving CMS data to Supabase:', error);
    return false;
  }
}

// Insert new client inquiry into Supabase
export async function insertInquiryToSupabase(inquiry: Partial<VIPInquiry>): Promise<VIPInquiry | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const id = inquiry.id || `inq-${Date.now()}`;
    const newRecord = {
      id,
      client_name: inquiry.clientName,
      email: inquiry.email,
      phone: inquiry.phone,
      event_type: inquiry.eventType,
      estimated_date: inquiry.estimatedDate,
      location: inquiry.location,
      guest_count: inquiry.guestCount,
      budget_range: inquiry.budgetRange,
      vision_notes: inquiry.visionNotes,
      status: inquiry.status || 'reviewing',
      created_at: inquiry.createdAt || new Date().toISOString(),
    };

    const { data, error } = await client.from('vip_inquiries').insert(newRecord).select().single();
    if (error) {
      console.warn('Error inserting inquiry into Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      clientName: data.client_name,
      email: data.email,
      phone: data.phone,
      eventType: data.event_type,
      estimatedDate: data.estimated_date,
      location: data.location,
      guestCount: data.guest_count,
      budgetRange: data.budget_range,
      visionNotes: data.vision_notes,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.warn('Supabase inquiry insert failed:', err);
    return null;
  }
}
