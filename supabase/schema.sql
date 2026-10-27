-- =====================================================================
-- TARE PRECIOUS — SUPABASE DATABASE SCHEMA
-- Luxury Scenography & Architectural Event Direction CMS
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    brand_name TEXT NOT NULL DEFAULT 'Tare Precious',
    monogram TEXT NOT NULL DEFAULT 'ZO',
    tagline TEXT NOT NULL DEFAULT 'MASTER SCENOGRAPHER & LUXURY EVENT ARCHITECT',
    short_bio TEXT DEFAULT 'Directing bespoke imperial weddings, presidential state galas, and monumental milestone celebrations across Lagos, Abuja, London, and Dubai.',
    location TEXT DEFAULT 'Victoria Island, Lagos · Abuja · London · Dubai',
    logo_light TEXT,
    logo_dark TEXT,
    theme_preset TEXT DEFAULT 'darkroom_walnut',
    primary_color TEXT DEFAULT '#100904',
    secondary_color TEXT DEFAULT '#ffedd7',
    accent_color TEXT DEFAULT '#dc5000',
    canvas_color TEXT DEFAULT '#100904',
    font_serif TEXT DEFAULT 'Halyard Display',
    font_sans TEXT DEFAULT 'Inter',
    social_links JSONB DEFAULT '{"instagram": "https://instagram.com/zaraokonjo.events", "linkedin": "https://linkedin.com/in/zara-okonjo"}'::jsonb,
    contact_email TEXT DEFAULT 'concierge@zaraokonjo.com',
    contact_phone TEXT DEFAULT '+234 (0) 803 888 2026',
    bottom_bar_status_text TEXT DEFAULT 'CURRENTLY ACCEPTING 2026/2027 COMMISSIONS',
    footer_copyright TEXT DEFAULT '© 2026 Tare Precious. ALL RIGHTS RESERVED.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLANNER PROFILE & CAREER STORY TABLE
CREATE TABLE IF NOT EXISTS public.planner_profile (
    id TEXT PRIMARY KEY DEFAULT 'default_planner',
    full_name TEXT NOT NULL DEFAULT 'Tare Precious',
    title TEXT NOT NULL DEFAULT 'Principal Event Architect & Lead Scenographer',
    tagline TEXT DEFAULT 'Architect of monumental African luxury nuptials, presidential state galas, and global celebrations.',
    portrait_image TEXT DEFAULT 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    curator_bio TEXT DEFAULT 'Tare Precious James is an event planning and delivery professional who brings structure, calm, and considered detail to complex live experiences.',
    philosophy_statement TEXT DEFAULT 'An extraordinary celebration is never merely decorated; it is composed like a sovereign symphony of light, monumental architecture, botanical couture, and deep heritage devotion.',
    signature_style TEXT DEFAULT 'Monolithic Nigerian brass banquets, floating oceanfront glass domes, and 50,000-stem cascading orchid architecture.',
    experience_years INTEGER DEFAULT 14,
    events_organized INTEGER DEFAULT 460,
    countries_worked INTEGER DEFAULT 11,
    satisfaction_rate TEXT DEFAULT '100% Bespoke',
    milestones JSONB DEFAULT '[]'::jsonb,
    specialties TEXT[] DEFAULT ARRAY['Imperial Nigerian Weddings', 'Presidential & State Galas', 'Banana Island & Private Estate Soirées', 'Real-Time 3D Photometric Spatial Staging', 'Multi-Day International Destination Nuptials'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVENT PROJECTS / MASTERPIECES TABLE
CREATE TABLE IF NOT EXISTS public.event_projects (
    id TEXT PRIMARY KEY DEFAULT ('event-' || uuid_generate_v4()::text),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL,
    venue TEXT NOT NULL,
    guest_count TEXT,
    budget_tier TEXT,
    cover_image TEXT NOT NULL,
    inline_headline_image TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_reel_url TEXT,
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
    vendor_credits JSONB DEFAULT '[]'::jsonb,
    client_quote JSONB,
    is_featured BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICE PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.service_packages (
    id TEXT PRIMARY KEY DEFAULT ('srv-' || uuid_generate_v4()::text),
    title TEXT NOT NULL,
    tagline TEXT,
    tier_badge TEXT,
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
    timeline TEXT,
    investment_tier TEXT,
    is_featured BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TESTIMONIALS & PRESS REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT ('t-' || uuid_generate_v4()::text),
    quote TEXT NOT NULL,
    client_name TEXT NOT NULL,
    event_title TEXT,
    location TEXT,
    date TEXT,
    press_outlet TEXT,
    press_logo_url TEXT,
    is_featured BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VIP CLIENT INQUIRIES & COMMISSION INTAKE CRM TABLE
CREATE TABLE IF NOT EXISTS public.vip_inquiries (
    id TEXT PRIMARY KEY DEFAULT ('inq-' || uuid_generate_v4()::text),
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_type TEXT DEFAULT 'Imperial Nuptials (3-Day)',
    estimated_date TEXT,
    location TEXT DEFAULT 'Lagos, Nigeria',
    guest_count TEXT,
    budget_range TEXT,
    vision_notes TEXT,
    status TEXT DEFAULT 'reviewing' CHECK (status IN ('new', 'reviewing', 'proposal_sent', 'contracted', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NAVIGATION ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 1,
    is_visible BOOLEAN DEFAULT true,
    is_cta BOOLEAN DEFAULT false
);

-- 8. SECTIONS CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.sections_config (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    title TEXT,
    kicker TEXT,
    subtitle TEXT,
    sort_order INTEGER DEFAULT 1,
    is_enabled BOOLEAN DEFAULT true,
    badge_text TEXT
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections_config ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for website display
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Planner" ON public.planner_profile;
CREATE POLICY "Public Read Planner" ON public.planner_profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Projects" ON public.event_projects;
CREATE POLICY "Public Read Projects" ON public.event_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Services" ON public.service_packages;
CREATE POLICY "Public Read Services" ON public.service_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Navigation" ON public.navigation_items;
CREATE POLICY "Public Read Navigation" ON public.navigation_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Sections" ON public.sections_config;
CREATE POLICY "Public Read Sections" ON public.sections_config FOR SELECT USING (true);

-- Allow Public / Anonymous Client Inquiries Intake
DROP POLICY IF EXISTS "Public Insert Inquiries" ON public.vip_inquiries;
CREATE POLICY "Public Insert Inquiries" ON public.vip_inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Inquiries" ON public.vip_inquiries;
CREATE POLICY "Public Read Inquiries" ON public.vip_inquiries FOR SELECT USING (true);

-- Allow All Operations for Service Role / Authenticated CMS Admins
DROP POLICY IF EXISTS "Service Role Full Access Settings" ON public.site_settings;
CREATE POLICY "Service Role Full Access Settings" ON public.site_settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Planner" ON public.planner_profile;
CREATE POLICY "Service Role Full Access Planner" ON public.planner_profile FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Projects" ON public.event_projects;
CREATE POLICY "Service Role Full Access Projects" ON public.event_projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Services" ON public.service_packages;
CREATE POLICY "Service Role Full Access Services" ON public.service_packages FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Testimonials" ON public.testimonials;
CREATE POLICY "Service Role Full Access Testimonials" ON public.testimonials FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Inquiries" ON public.vip_inquiries;
CREATE POLICY "Service Role Full Access Inquiries" ON public.vip_inquiries FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Navigation" ON public.navigation_items;
CREATE POLICY "Service Role Full Access Navigation" ON public.navigation_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role Full Access Sections" ON public.sections_config;
CREATE POLICY "Service Role Full Access Sections" ON public.sections_config FOR ALL USING (true);

-- =====================================================================
-- STORAGE BUCKET CONFIGURATION (for high-res scenography assets)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-assets', 'cms-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access CMS Assets" ON storage.objects;
CREATE POLICY "Public Access CMS Assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'cms-assets');

DROP POLICY IF EXISTS "Allow Public Uploads to CMS Assets" ON storage.objects;
CREATE POLICY "Allow Public Uploads to CMS Assets" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'cms-assets');

DROP POLICY IF EXISTS "Allow Update on CMS Assets" ON storage.objects;
CREATE POLICY "Allow Update on CMS Assets" ON storage.objects 
FOR UPDATE USING (bucket_id = 'cms-assets');

DROP POLICY IF EXISTS "Allow Delete on CMS Assets" ON storage.objects;
CREATE POLICY "Allow Delete on CMS Assets" ON storage.objects 
FOR DELETE USING (bucket_id = 'cms-assets');
