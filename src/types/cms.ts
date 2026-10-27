export type ThemePreset = 'darkroom_walnut' | 'obsidian_gold' | 'bone_paper_noir' | 'champagne_silk' | 'emerald_velvet' | 'monochrome_minimal';

export interface CareerMilestone {
  year: string;
  title: string;
  role: string;
  location: string;
  description: string;
}

export interface PlannerProfile {
  fullName: string;
  title: string;
  tagline: string;
  portraitImage: string;
  curatorBio: string;
  philosophyStatement: string;
  signatureStyle: string;
  experienceYears: number;
  eventsOrganized: number;
  countriesWorked: number;
  satisfactionRate: string;
  milestones: CareerMilestone[];
  specialties: string[];
}

export interface SiteSettings {
  brandName: string;
  monogram: string;
  tagline: string;
  shortBio: string;
  location: string;
  logoLight: string;
  logoDark: string;
  themePreset: ThemePreset;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  canvasColor: string;
  fontSerif: string;
  fontSans: string;
  socialLinks: {
    instagram?: string;
    pinterest?: string;
    linkedin?: string;
    vimeo?: string;
  };
  contactEmail: string;
  contactPhone: string;
  bottomBarStatusText: string;
  footerCopyright: string;
  planner: PlannerProfile;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isVisible: boolean;
  isCta?: boolean;
}

export type SectionKey =
  | 'hero_3d'
  | 'about_planner'
  | 'experience_stats'
  | 'masterpieces'
  | 'scenography_3d'
  | 'services'
  | 'process'
  | 'press_testimonials'
  | 'vip_inquiry';

export interface SectionConfig {
  key: SectionKey;
  label: string;
  title: string;
  kicker: string;
  subtitle: string;
  order: number;
  isEnabled: boolean;
  badgeText?: string;
}

export interface EventProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Luxury Wedding' | 'Gala & Ball' | 'Private Soirée' | 'Fashion Scenography' | 'Experiential Activation' | string;
  year: string;
  location: string;
  venue: string;
  guestCount: string;
  budgetTier: string;
  coverImage: string;
  inlineHeadlineImage?: string;
  galleryImages: string[];
  videoReelUrl?: string;
  description: string;
  deliverables: string[];
  vendorCredits?: { role: string; name: string }[];
  clientQuote?: { quote: string; author: string };
  isFeatured: boolean;
  order: number;
}

export interface ServicePackage {
  id: string;
  title: string;
  tagline: string;
  tierBadge: string;
  description: string;
  deliverables: string[];
  timeline: string;
  investmentTier: string;
  isFeatured: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  eventTitle: string;
  location: string;
  date: string;
  pressOutlet?: string;
  pressLogoUrl?: string;
  avatar?: string;
  isFeatured: boolean;
  order: number;
}

export interface VIPInquiry {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  eventType: string;
  estimatedDate: string;
  location: string;
  guestCount: string;
  budgetRange: string;
  visionNotes: string;
  status: 'new' | 'reviewing' | 'proposal_sent' | 'booked' | 'archived';
  createdAt: string;
}

export interface CmsDatabase {
  settings: SiteSettings;
  navigation: NavigationItem[];
  sections: SectionConfig[];
  events: EventProject[];
  services: ServicePackage[];
  testimonials: Testimonial[];
  inquiries: VIPInquiry[];
}
