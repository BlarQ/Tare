-- =====================================================================
-- TARE PRECIOUS — SEED DATA SCRIPT FOR SUPABASE
-- Run after schema.sql to populate all initial tables
-- =====================================================================

-- 1. SEED SITE SETTINGS
INSERT INTO public.site_settings (
    id, brand_name, monogram, tagline, short_bio, location,
    theme_preset, primary_color, secondary_color, accent_color, canvas_color,
    font_serif, font_sans, social_links, contact_email, contact_phone,
    bottom_bar_status_text, footer_copyright
) VALUES (
    'default_settings',
    'Tare Precious',
    'ZO',
    'MASTER SCENOGRAPHER & LUXURY EVENT ARCHITECT',
    'Directing bespoke imperial weddings, presidential state galas, and monumental milestone celebrations across Lagos, Abuja, London, and Dubai.',
    'Victoria Island, Lagos · Abuja · London · Dubai',
    'darkroom_walnut',
    '#100904',
    '#ffedd7',
    '#dc5000',
    '#100904',
    'Halyard Display',
    'Inter',
    '{"instagram": "https://instagram.com/tareprecious.events", "pinterest": "https://pinterest.com/tareprecious", "linkedin": "https://linkedin.com/in/tare-precious"}'::jsonb,
    'tareprecious5122@gmail.com',
    '+234 (0) 803 888 2026',
    'CURRENTLY ACCEPTING 2026/2027 COMMISSIONS',
    '© 2026 Tare Precious. ALL RIGHTS RESERVED.'
) ON CONFLICT (id) DO UPDATE SET
    brand_name = EXCLUDED.brand_name,
    tagline = EXCLUDED.tagline,
    location = EXCLUDED.location,
    updated_at = NOW();

-- 2. SEED PLANNER PROFILE
INSERT INTO public.planner_profile (
    id, full_name, title, tagline, portrait_image, curator_bio,
    philosophy_statement, signature_style, experience_years, events_organized,
    countries_worked, satisfaction_rate, milestones, specialties
) VALUES (
    'default_planner',
    'Tare Precious',
    'Principal Event Architect & Lead Scenographer',
    'Architect of monumental African luxury nuptials, presidential state galas, and global celebrations.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    'Tare Precious James is an event planning and delivery professional who brings structure, calm, and considered detail to complex live experiences across corporate, executive, international, and large-scale events.',
    'An extraordinary celebration is never merely decorated; it is composed like a sovereign symphony of light, monumental architecture, botanical couture, and deep heritage devotion.',
    'Monolithic Nigerian brass banquets, floating oceanfront glass domes, and 50,000-stem cascading orchid architecture.',
    14,
    460,
    11,
    '100% Bespoke',
    '[
        {"year": "2026", "title": "The Eko Atlantic Glass Pavilion Nuptials", "role": "Master Creative Director & Producer", "location": "Eko Atlantic, Lagos", "description": "Orchestrated a ₦350M+ cantilevered floating glass dome over the ocean for 1,400 VIP guests with 50,000 white orchids and 70-piece live orchestra."},
        {"year": "2025", "title": "The Aso Rock Presidential Inaugural Gala", "role": "Lead Scenographer & Production Director", "location": "Abuja, Nigeria", "description": "Transformed the State Banqueting Hall into a golden acacia forest with 360° projection mapping for heads of state and international diplomats."},
        {"year": "2024", "title": "Forbes Africa Top 5 Luxury Event Architects", "role": "Featured Honoree & Cover Profile", "location": "Pan-African", "description": "Recognized for pioneering real-time 3D photometric pre-visualization in African high-society weddings and state banquets."},
        {"year": "2023", "title": "Banana Island Billionaire 50th Lagoon Soirée", "role": "Executive Planner & VIP Concierge", "location": "Ikoyi, Lagos", "description": "3-tier floating pontoon over Lagos Lagoon with private helipad reception and synchronized midnight pyrotechnics."},
        {"year": "2019", "title": "Burj Al Arab Transcontinental Wedding", "role": "Lead Destination Director", "location": "Dubai & Lagos", "description": "3-day transcontinental luxury celebration connecting royal Nigerian families with bespoke desert glasshouse staging."},
        {"year": "2021", "title": "Founded Tare Precious", "role": "Founder & Event Planner", "location": "Lagos, Nigeria", "description": "Built an event planning and delivery practice for corporate, executive, international, and large-scale experiences."}
    ]'::jsonb,
    ARRAY['Imperial Nigerian Weddings (Traditional & White)', 'Presidential & State Galas', 'Banana Island & Private Estate Soirées', 'Real-Time 3D Photometric Spatial Staging', 'Multi-Day International Destination Nuptials']
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    curator_bio = EXCLUDED.curator_bio,
    updated_at = NOW();

-- 3. SEED EVENT PROJECTS
INSERT INTO public.event_projects (
    id, slug, title, subtitle, category, year, location, venue, guest_count, budget_tier,
    cover_image, gallery_images, description, deliverables, vendor_credits, client_quote, is_featured, sort_order
) VALUES
(
    'event-1',
    'eko-atlantic-glass-pavilion-nuptials',
    'THE EKO ATLANTIC IMPERIAL NUPTIALS',
    'Eko Atlantic Oceanfront, Lagos',
    'Imperial Wedding (3-Day)',
    '2026',
    'Victoria Island & Eko Atlantic, Lagos',
    'Custom Cantilevered Glass Dome over the Atlantic',
    '1,400 VIP Guests',
    '₦350M+ / $450k+',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', 'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=1200&auto=format&fit=crop'],
    'A 3-day royal union celebrated in a custom-built 4,000-square-meter cantilevered glass pavilion extending over the Atlantic shoreline. Featuring 50,000 cascading Dutch white calla lilies and Phalaenopsis orchids, 24k gold leaf royal banquets, a 9-tier kinetic crystal chandelier, and live orchestral performances by a 70-piece symphonic ensemble.',
    ARRAY['Custom 4,000 sqm Cantilevered Oceanfront Glass Pavilion', '50,000-Stem Cascading White Orchid & Floral Architecture', '9-Tier Central Kinetic Crystal Chandelier Array', 'Traditional Yoruba Alaga & White Wedding Direction', 'Helicopter & Motorcade VIP Convoy Logistics'],
    '[{"role": "Event Planning & Delivery", "name": "Tare Precious"}, {"role": "Floral Haute Couture", "name": "Maison Florale Lagos"}]'::jsonb,
    '{"quote": "Tare turned our 3-day wedding into an imperial sovereign dream. Guests flew in from London, New York, and Geneva and are still talking about the sheer majesty of the ocean glasshouse.", "author": "Chief & Dr. (Mrs.) O. Adeleke"}'::jsonb,
    true,
    1
),
(
    'event-2',
    'aso-rock-presidential-inaugural-gala',
    'ASO ROCK PRESIDENTIAL INAUGURAL GALA',
    'State House Grand Hall, Abuja',
    'Presidential & State Banquet',
    '2025',
    'Abuja, Federal Capital Territory',
    'State House Banqueting Hall',
    '650 Dignitaries & Ambassadors',
    '₦450M+ / $600k+',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop'],
    'A transformative state gala hosting visiting heads of state and diplomats. The banqueting hall was cloaked in a golden savannah canopy with 360-degree immersive architectural projection mapping and 180-meter continuous brass banquet tables.',
    ARRAY['180-Meter Solid Nigerian Brass Mirrored Banquets', 'Architectural 360° Synchronized Projection Canopy', 'Diplomatic Head-of-State Protocol Coordination', 'Curated Pan-African 7-Course Haute Cuisine'],
    '[{"role": "Event Planner & Delivery Lead", "name": "Tare Precious"}]'::jsonb,
    '{"quote": "The photometric 3D simulator Tare presented to the State Protocol team gave us 100% confidence. Execution was immaculate to the second.", "author": "Ambassador K. Danjuma"}'::jsonb,
    true,
    2
),
(
    'event-3',
    'banana-island-lagoon-soiree',
    'THE BANANA ISLAND LAGOON SOIRÉE',
    'Ikoyi, Lagos',
    'Billionaire Milestone Birthday',
    '2025',
    'Banana Island, Ikoyi, Lagos',
    'Private Waterfront Estate & Floating Pontoon',
    '220 Ultra-HNW Patrons',
    '₦280M+ / $350k+',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'],
    'A 50th birthday celebration for a Nigerian oil & technology magnate. We engineered a 3-tier floating pontoon over Lagos Lagoon featuring an illuminated Dom Pérignon champagne fountain and a synchronized 400-drone aerial light show over the water.',
    ARRAY['3-Tier Engineered Waterfront Floating Pontoon', '400-Drone Synchronized Lagoon Light Choreography', 'Vintage Dom Pérignon Vault & Beluga Caviar Bar'],
    '[{"role": "Executive Direction", "name": "Tare Precious"}]'::jsonb,
    '{"quote": "Tare redefined luxury entertaining on Banana Island. The floating pontoon took everybody by surprise.", "author": "F. Alakija, Host"}'::jsonb,
    true,
    3
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 4. SEED SERVICE PACKAGES
INSERT INTO public.service_packages (
    id, title, tagline, tier_badge, description, deliverables, timeline, investment_tier, is_featured, sort_order
) VALUES
(
    'srv-1',
    'IMPERIAL NUPTIALS & 3-DAY CELEBRATIONS',
    'Complete 360-degree planning, traditional engagement & white wedding direction.',
    'SIGNATURE SERVICE',
    'Tare personally oversees all facets: multi-day guest hospitality, custom 3D WebGL pre-visualization, traditional royal protocol, 50,000-stem floral couture, top Nigerian & international culinary brigades, and turnkey on-site production.',
    ARRAY['Dedicated 24/7 VIP Concierge & Master Protocol Team', '3D Real-Time Spatial Modeling & Photometric Simulation', 'Curated International & Nigerian Luxury Vendors', 'Full Day-of On-Site Production Team (30+ Senior Staff)'],
    '8 — 16 Months in Advance',
    'Full Planning from ₦45,000,000 / $50,000',
    true,
    1
),
(
    'srv-2',
    'SPATIAL SCENOGRAPHY & LIGHTING ARCHITECTURE',
    'Transformative structural builds, botanical architecture, and lighting design.',
    'DESIGN & PRODUCTION',
    'For clients and brands with logistics handled who require Tare architectural mastery to build custom pavilions, monolithic mirrored banquets, and volumetric light shows.',
    ARRAY['Architectural Spatial Blueprints & 3D Lighting Decks', 'Master Botanical & Floral Haute Couture Direction', 'Custom Monogram Tableware & African Brass Accents'],
    '4 — 8 Months in Advance',
    'Scenography Direction from ₦25,000,000 / $30,000',
    true,
    2
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED VIP INQUIRIES
INSERT INTO public.vip_inquiries (
    id, client_name, email, phone, event_type, estimated_date, location, guest_count, budget_range, vision_notes, status
) VALUES
(
    'inq-1',
    'Senator T. Briggs & Family',
    't.briggs@briggsgroup.ng',
    '+234 802 333 4455',
    'Imperial Nuptials (3-Day)',
    '2026-11-20',
    'Eko Atlantic, Lagos & Port Harcourt',
    '1,200 VIPs',
    '₦250M — ₦400M',
    'Seeking custom floating ocean marquee with gold monolith banquets and live highlife/classical fusion.',
    'reviewing'
)
ON CONFLICT (id) DO NOTHING;
