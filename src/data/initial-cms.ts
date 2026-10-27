import { CmsDatabase } from '@/types/cms';

export const initialCmsData: CmsDatabase = {
  settings: {
    brandName: 'Tare Precious',
    monogram: 'ZO',
    tagline: 'MASTER SCENOGRAPHER & LUXURY EVENT ARCHITECT',
    shortBio: 'Directing bespoke imperial weddings, presidential state galas, and monumental milestone celebrations across Lagos, Abuja, London, and Dubai.',
    location: 'FESTAC TOWN, LAGOS, NIGERIA',
    logoLight: '',
    logoDark: '',
    themePreset: 'darkroom_walnut',
    primaryColor: '#100904',
    secondaryColor: '#ffedd7',
    accentColor: '#dc5000',
    canvasColor: '#100904',
    fontSerif: 'Halyard Display',
    fontSans: 'Inter',
    socialLinks: {
      instagram: 'https://instagram.com/zaraokonjo.events',
      pinterest: 'https://pinterest.com/zaraokonjo',
      linkedin: 'https://linkedin.com/in/zara-okonjo',
      vimeo: 'https://vimeo.com/zaraokonjo',
    },
    contactEmail: 'tareprecious5122@gmail.com',
    contactPhone: '+234 9020 804 049',
    bottomBarStatusText: 'CURRENTLY ACCEPTING 2026/2027 COMMISSIONS',
    footerCopyright: '© 2026 Tare Precious. ALL RIGHTS RESERVED. EVENT PLANNING & DELIVERY.',
    planner: {
      fullName: 'Tare Precious',
      title: 'Principal Event Architect & Lead Scenographer',
      tagline: 'Architect of monumental African luxury nuptials, presidential state galas, and global celebrations.',
      portraitImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
      curatorBio: 'Tare Precious James is an event planning and delivery professional who brings structure, calm, and considered detail to complex live experiences across corporate, executive, international, and large-scale events.',
      philosophyStatement: 'An extraordinary celebration is never merely decorated; it is composed like a sovereign symphony of light, monumental architecture, botanical couture, and deep heritage devotion.',
      signatureStyle: 'Monolithic Nigerian brass banquets, floating oceanfront glass domes, and 50,000-stem cascading orchid architecture.',
      experienceYears: 5,
      eventsOrganized: 20,
      countriesWorked: 11,
      satisfactionRate: '100% Bespoke',
      milestones: [
        {
          year: '2026',
          title: 'The Eko Atlantic Glass Pavilion Nuptials',
          role: 'Master Creative Director & Producer',
          location: 'Eko Atlantic, Lagos',
          description: 'Orchestrated a ₦350M+ cantilevered floating glass dome over the ocean for 1,400 VIP guests with 50,000 white orchids and 70-piece live orchestra.'
        },
        {
          year: '2025',
          title: 'The Aso Rock Presidential Inaugural Gala',
          role: 'Lead Scenographer & Production Director',
          location: 'Abuja, Nigeria',
          description: 'Transformed the State Banqueting Hall into a golden acacia forest with 360° projection mapping for heads of state and international diplomats.'
        },
        {
          year: '2024',
          title: 'Forbes Africa "Top 5 Luxury Event Architects"',
          role: 'Featured Honoree & Cover Profile',
          location: 'Pan-African',
          description: 'Recognized for pioneering real-time 3D photometric pre-visualization in African high-society weddings and state banquets.'
        },
        {
          year: '2023',
          title: 'Banana Island Billionaire 50th Lagoon Soirée',
          role: 'Executive Planner & VIP Concierge',
          location: 'Ikoyi, Lagos',
          description: '3-tier floating pontoon over Lagos Lagoon with private helipad reception and synchronized midnight pyrotechnics.'
        },
        {
          year: '2019',
          title: 'Burj Al Arab Transcontinental Wedding',
          role: 'Lead Destination Director',
          location: 'Dubai & Lagos',
          description: '3-day transcontinental luxury celebration connecting royal Nigerian families with bespoke desert glasshouse staging.'
        },
        {
          year: '2012',
          title: 'Founded Tare Precious',
          role: 'Founder & Principal Director',
          location: 'Victoria Island, Lagos',
          description: 'Launched a bespoke private commission studio accepting strictly 10 commissions per year worldwide.'
        }
      ],
      specialties: [
        'Imperial Nigerian Weddings (Traditional & White)',
        'Presidential & State Galas',
        'Banana Island & Private Estate Soirées',
        'Real-Time 3D Photometric Spatial Staging',
        'Multi-Day International Destination Nuptials'
      ]
    }
  },
  navigation: [
    { id: 'nav-1', label: 'THE ARCHITECT', url: '#stage-0', order: 1, isVisible: true },
    { id: 'nav-2', label: 'PHILOSOPHY', url: '#stage-1', order: 2, isVisible: true },
    { id: 'nav-3', label: 'MASTERPIECES', url: '#stage-2', order: 3, isVisible: true },
    { id: 'nav-4', label: 'TRACK RECORD', url: '#stage-7', order: 4, isVisible: true },
    { id: 'nav-5', label: 'SERVICES', url: '#stage-8', order: 5, isVisible: true },
    { id: 'nav-6', label: 'VIP INQUIRY', url: '#stage-9', order: 6, isVisible: true, isCta: true }
  ],
  sections: [
    {
      key: 'hero_3d',
      label: 'Hero & Creative Director Profile',
      title: 'Tare Precious',
      kicker: 'MASTER SCENOGRAPHER & LUXURY EVENT ARCHITECT',
      subtitle: 'Sculpting Africa’s most revered imperial weddings, presidential banquets, and milestone celebrations.',
      order: 1,
      isEnabled: true,
      badgeText: '14 YEARS DIRECTION · LAGOS / ABUJA / LONDON / DUBAI'
    },
    {
      key: 'about_planner',
      label: 'Philosophy & Scenographic Craft',
      title: 'SPATIAL ARCHITECTURE MEETS NIGERIAN ROYAL SPLENDOR',
      kicker: '01 / HER PHILOSOPHY & ETHOS',
      subtitle: 'Where sovereign West African grandeur unites with London structural precision.',
      order: 2,
      isEnabled: true
    },
    {
      key: 'masterpieces',
      label: 'Curated Masterpiece Case Studies',
      title: 'MONUMENTAL EVENT ARCHIVES',
      kicker: '02 / CURATED WORKS',
      subtitle: 'Explore recent high-society weddings, presidential galas, and private lagoon soirées.',
      order: 3,
      isEnabled: true
    },
    {
      key: 'experience_stats',
      label: 'Track Record & 14-Year Milestones',
      title: '14 YEARS OF MONUMENTAL CELEBRATIONS',
      kicker: '03 / TRACK RECORD & METRICS',
      subtitle: 'A proven legacy of orchestrating complex, high-discretion productions for royalty and dignitaries.',
      order: 4,
      isEnabled: true
    },
    {
      key: 'services',
      label: 'Services & Bespoke Commissions',
      title: 'SIGNATURE PLANNING & DIRECTION PILLARS',
      kicker: '04 / CAPABILITIES & OFFERINGS',
      subtitle: 'Full-service planning, 3D spatial scenography, destination coordination, and VIP concierge.',
      order: 5,
      isEnabled: true
    },
    {
      key: 'vip_inquiry',
      label: 'Private Commission Intake',
      title: 'RESERVE A PRIVATE COMMISSION',
      kicker: '05 / VIP CONCIERGE INTAKE',
      subtitle: 'Strictly 10 bespoke commissions accepted annually across Africa, Europe, and the Middle East.',
      order: 6,
      isEnabled: true
    }
  ],
  events: [
    {
      id: 'event-1',
      slug: 'eko-atlantic-glass-pavilion-nuptials',
      title: 'THE EKO ATLANTIC IMPERIAL NUPTIALS',
      subtitle: 'Eko Atlantic Oceanfront, Lagos',
      category: 'Imperial Wedding (3-Day)',
      year: '2026',
      location: 'Victoria Island & Eko Atlantic, Lagos',
      venue: 'Custom Cantilevered Glass Dome over the Atlantic',
      guestCount: '1,400 VIP Guests',
      budgetTier: '₦350M+ / $450k+',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
      inlineHeadlineImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop'
      ],
      videoReelUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-bride-and-groom-holding-a-bouquet-4824-large.mp4',
      description: 'A 3-day royal union celebrated in a custom-built 4,000-square-meter cantilevered glass pavilion extending over the Atlantic shoreline. Featuring 50,000 cascading Dutch white calla lilies and Phalaenopsis orchids, 24k gold leaf royal banquets, a 9-tier kinetic crystal chandelier, and live orchestral performances by a 70-piece symphonic ensemble.',
      deliverables: [
        'Custom 4,000 sqm Cantilevered Oceanfront Glass Pavilion',
        '50,000-Stem Cascading White Orchid & Floral Architecture',
        '9-Tier Central Kinetic Crystal Chandelier Array',
        'Traditional Yoruba Alaga & White Wedding Direction',
        'Helicopter & Motorcade VIP Convoy Logistics'
      ],
      vendorCredits: [
        { role: 'Event Planning & Delivery', name: 'Tare Precious' },
        { role: 'Floral Haute Couture', name: 'Maison Florale Lagos' },
        { role: 'Gastronomy', name: 'Chef Eros Private Brigade' },
        { role: 'Sound & Symphonics', name: 'Lagos Philharmonic & The Cavemen Live' }
      ],
      clientQuote: {
        quote: 'Zara turned our 3-day wedding into an imperial sovereign dream. Guests flew in from London, New York, and Geneva and are still talking about the sheer majesty of the ocean glasshouse.',
        author: 'Chief & Dr. (Mrs.) O. Adeleke'
      },
      isFeatured: true,
      order: 1
    },
    {
      id: 'event-2',
      slug: 'aso-rock-presidential-inaugural-gala',
      title: 'ASO ROCK PRESIDENTIAL INAUGURAL GALA',
      subtitle: 'State House Grand Hall, Abuja',
      category: 'Presidential & State Banquet',
      year: '2025',
      location: 'Abuja, Federal Capital Territory',
      venue: 'State House Banqueting Hall',
      guestCount: '650 Dignitaries & Ambassadors',
      budgetTier: '₦450M+ / $600k+',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      inlineHeadlineImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop'
      ],
      videoReelUrl: 'https://assets.mixkit.co/videos/preview/mixkit-champagne-glasses-at-a-luxurious-party-41775-large.mp4',
      description: 'A transformative state gala hosting visiting heads of state and diplomats. The banqueting hall was cloaked in a golden savannah canopy with 360-degree immersive architectural projection mapping and 180-meter continuous brass banquet tables.',
      deliverables: [
        '180-Meter Solid Nigerian Brass Mirrored Banquets',
        'Architectural 360° Synchronized Projection Canopy',
        'Diplomatic Head-of-State Protocol Coordination',
        'Curated Pan-African 7-Course Haute Cuisine'
      ],
      vendorCredits: [
        { role: 'Event Planner & Delivery Lead', name: 'Tare Precious' },
        { role: 'Lighting Architecture', name: 'Lumière Africa & UK' }
      ],
      clientQuote: {
        quote: 'The photometric 3D simulator Zara presented to the State Protocol team gave us 100% confidence. Execution was immaculate to the second.',
        author: 'Ambassador K. Danjuma'
      },
      isFeatured: true,
      order: 2
    },
    {
      id: 'event-3',
      slug: 'banana-island-lagoon-soiree',
      title: 'THE BANANA ISLAND LAGOON SOIRÉE',
      subtitle: 'Ikoyi, Lagos',
      category: 'Billionaire Milestone Birthday',
      year: '2025',
      location: 'Banana Island, Ikoyi, Lagos',
      venue: 'Private Waterfront Estate & Floating Pontoon',
      guestCount: '220 Ultra-HNW Patrons',
      budgetTier: '₦280M+ / $350k+',
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      inlineHeadlineImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
      ],
      description: 'A 50th birthday celebration for a Nigerian oil & technology magnate. We engineered a 3-tier floating pontoon over Lagos Lagoon featuring an illuminated Dom Pérignon champagne fountain and a synchronized 400-drone aerial light show over the water.',
      deliverables: [
        '3-Tier Engineered Waterfront Floating Pontoon',
        '400-Drone Synchronized Lagoon Light Choreography',
        'Vintage Dom Pérignon Vault & Beluga Caviar Bar',
        'Private Superyacht Shuttle Service'
      ],
      vendorCredits: [
        { role: 'Executive Direction', name: 'Tare Precious' }
      ],
      clientQuote: {
        quote: 'Zara redefined luxury entertaining on Banana Island. The floating pontoon took everybody by surprise.',
        author: 'F. Alakija, Host'
      },
      isFeatured: true,
      order: 3
    },
    {
      id: 'event-4',
      slug: 'calabar-monolith-heritage-ball',
      title: 'CALABAR MONOLITH ROYAL BALL',
      subtitle: 'Calabar, Cross River',
      category: 'Afro-Futuristic Heritage Gala',
      year: '2025',
      location: 'Calabar, Nigeria',
      venue: 'Heritage Rainforest Canopy & Monolith Pavilion',
      guestCount: '500 Royal Patrons & Dignitaries',
      budgetTier: '₦200M+ / $250k+',
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop'
      ],
      description: 'An Afro-futuristic tribute celebrating the ancient Ikom Monoliths and Nigerian royal dynasties, featuring bespoke bronze monolith tables, handwoven Aso-Oke tapestries, and live orchestral highlife fusion.',
      deliverables: [
        'Bespoke Hand-Carved Bronze Monolith Banquets',
        'Handwoven Royal Aso-Oke Spatial Draping',
        'Live Heritage Orchestral Acoustic Scoring'
      ],
      vendorCredits: [
        { role: 'Scenography & Artistic Direction', name: 'Tare Precious' }
      ],
      isFeatured: false,
      order: 4
    },
    {
      id: 'event-5',
      slug: 'burj-al-arab-transcontinental-nuptials',
      title: 'THE ARABIAN GULF TRANSCONTINENTAL NUPTIALS',
      subtitle: 'Burj Al Arab & Desert Dunes, Dubai',
      category: 'Destination Luxury Wedding',
      year: '2024',
      location: 'Dubai, UAE & Lagos',
      venue: 'Burj Al Arab Helipad & Private Desert Marquee',
      guestCount: '380 International Guests',
      budgetTier: '$1.2M+ / ₦1.5B+',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
      ],
      description: 'A 3-day transcontinental luxury celebration seamlessly blending traditional Nigerian royal ceremonial customs with Dubai skyline opulence. Private Boeing 777 charters from Lagos and Abuja.',
      deliverables: [
        'Private Aviation Logistics & Diplomatic Fast-Track',
        'Desert Starlight Glass Marquee with Nigerian Floristry',
        'Traditional Yoruba Engagement on the Helipad'
      ],
      vendorCredits: [
        { role: 'Master Destination Producer', name: 'Tare Precious' }
      ],
      isFeatured: false,
      order: 5
    }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'IMPERIAL NUPTIALS & 3-DAY CELEBRATIONS',
      tagline: 'Complete 360-degree planning, traditional engagement & white wedding direction.',
      tierBadge: 'SIGNATURE SERVICE',
      description: 'Zara personally oversees all facets: multi-day guest hospitality, custom 3D WebGL pre-visualization, traditional royal protocol, 50,000-stem floral couture, top Nigerian & international culinary brigades, and turnkey on-site production.',
      deliverables: [
        'Dedicated 24/7 VIP Concierge & Master Protocol Team',
        '3D Real-Time Spatial Modeling & Photometric Simulation',
        'Curated International & Nigerian Luxury Vendors',
        'Comprehensive ₦/$/£ Multi-Currency Financial Governance',
        'Full Day-of On-Site Production Team (30+ Senior Staff)'
      ],
      timeline: '8 — 16 Months in Advance',
      investmentTier: 'Full Planning from ₦45,000,000 / $50,000',
      isFeatured: true,
      order: 1
    },
    {
      id: 'srv-2',
      title: 'SPATIAL SCENOGRAPHY & LIGHTING ARCHITECTURE',
      tagline: 'Transformative structural builds, botanical architecture, and lighting design.',
      tierBadge: 'DESIGN & PRODUCTION',
      description: 'For clients and brands with logistics handled who require Zara\'s architectural mastery to build jaw-dropping custom pavilions, monolithic mirrored banquets, and volumetric light shows.',
      deliverables: [
        'Architectural Spatial Blueprints & 3D Lighting Decks',
        'Master Botanical & Floral Haute Couture Direction',
        'Custom Monogram Tableware & African Brass Accents',
        'Architectural Light Mapping & Projection Design'
      ],
      timeline: '4 — 8 Months in Advance',
      investmentTier: 'Scenography Direction from ₦25,000,000 / $30,000',
      isFeatured: true,
      order: 2
    },
    {
      id: 'srv-3',
      title: 'PRESIDENTIAL & STATE BANQUET DIRECTION',
      tagline: 'High-protocol galas, head-of-state summits, and diplomatic banquets.',
      tierBadge: 'STATE & DIPLOMATIC',
      description: 'Specialized for presidential inaugurals, diplomatic summits, and global corporate summits requiring strict diplomatic seating protocols, encrypted guest communications, and discrete security coordination.',
      deliverables: [
        'Diplomatic Protocol & State Security Alignment',
        'Volumetric Audio-Visual & Simultaneous Translation Staging',
        'Executive Private Jet & Motorcade Coordination',
        'VIP Dignitary Concierge Management'
      ],
      timeline: '3 — 9 Months in Advance',
      investmentTier: 'State Direction from ₦35,000,000 / $40,000',
      isFeatured: false,
      order: 3
    }
  ],
  testimonials: [
    {
      id: 't-1',
      quote: 'Zara did not just plan our 3-day Eko Atlantic wedding; she orchestrated an imperial sovereign wonderland that royalty and global dignitaries still reminisce about. Every detail was otherworldly.',
      clientName: 'Chief & Dr. (Mrs.) O. Adeleke',
      eventTitle: 'Eko Atlantic Imperial Nuptials',
      location: 'Lagos, Nigeria',
      date: 'January 2026',
      pressOutlet: 'BellaNaija Weddings & Vogue',
      pressLogoUrl: '',
      isFeatured: true,
      order: 1
    },
    {
      id: 't-2',
      quote: 'The 3D spatial simulation Zara generated beforehand was millimeter-exact to the real Presidential Gala build in Abuja. Her production discipline is the highest on the African continent.',
      clientName: 'Ambassador K. Danjuma',
      eventTitle: 'Presidential Inaugural Committee',
      location: 'Abuja, Nigeria',
      date: 'May 2025',
      pressOutlet: 'Forbes Africa',
      pressLogoUrl: '',
      isFeatured: true,
      order: 2
    },
    {
      id: 't-3',
      quote: 'Tare Precious brings structure, calm, and thoughtful detail to every live experience. A true delivery partner.',
      clientName: 'F. Alakija',
      eventTitle: 'Banana Island Milestone Soirée',
      location: 'Banana Island, Lagos',
      date: 'November 2025',
      pressOutlet: 'CNN African Voices',
      pressLogoUrl: '',
      isFeatured: true,
      order: 3
    }
  ],
  inquiries: [
    {
      id: 'inq-1',
      clientName: 'Senator T. Briggs & Family',
      email: 't.briggs@briggsgroup.ng',
      phone: '+234 802 333 4455',
      eventType: 'Imperial Nuptials (3-Day)',
      estimatedDate: '2026-11-20',
      location: 'Eko Atlantic, Lagos & Port Harcourt',
      guestCount: '1,200 VIPs',
      budgetRange: '₦250M — ₦400M',
      visionNotes: 'Seeking custom floating ocean marquee with gold monolith banquets and live highlife/classical fusion.',
      status: 'reviewing',
      createdAt: '2026-09-25T14:30:00Z'
    },
    {
      id: 'inq-2',
      clientName: 'Hadiza Bello-Kano',
      email: 'h.bellokano@kanoholdings.com',
      phone: '+234 809 111 2233',
      eventType: 'Royal Durbar Anniversary Gala',
      estimatedDate: '2026-12-15',
      location: 'Kano & Abuja',
      guestCount: '800 Dignitaries',
      budgetRange: '₦300M+',
      visionNotes: 'Celebration of royal dynasty anniversary with traditional equestrian parade reception and royal palace banquet tent.',
      status: 'proposal_sent',
      createdAt: '2026-09-20T09:15:00Z'
    }
  ]
};
