import fs from 'fs';
import path from 'path';
import { CmsDatabase, SiteSettings, NavigationItem, SectionConfig, EventProject, ServicePackage, Testimonial, VIPInquiry } from '@/types/cms';
import { initialCmsData } from '@/data/initial-cms';
import { tarePortfolioContent } from '@/data/tare-portfolio';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms-store.json');

// In-memory cache for fast SSR / edge fallback
let memoryStore: CmsDatabase = JSON.parse(JSON.stringify(initialCmsData));

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialCmsData, null, 2), 'utf-8');
      memoryStore = JSON.parse(JSON.stringify(initialCmsData));
    }
  } catch (error) {
    console.warn('Could not write to filesystem, using in-memory store:', error);
  }
}

export function getCmsDatabase(): CmsDatabase {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Keep a newly created/local CMS useful even when it has not been
      // populated yet. The PDF-backed portfolio is the editorial baseline.
      if (!parsed.events?.length) parsed.events = tarePortfolioContent.events as EventProject[];
      if (!parsed.services?.length) parsed.services = tarePortfolioContent.services as ServicePackage[];
      if (!parsed.testimonials?.length) parsed.testimonials = tarePortfolioContent.testimonials as Testimonial[];
      memoryStore = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn('Error reading CMS database file, using memory store:', error);
  }
  return memoryStore;
}

export function saveCmsDatabase(data: CmsDatabase): boolean {
  try {
    ensureDataFile();
    memoryStore = data;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving CMS database:', error);
    memoryStore = data;
    return false;
  }
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const db = getCmsDatabase();
  db.settings = { ...db.settings, ...settings };
  saveCmsDatabase(db);
  return db.settings;
}

export function updateNavigation(navigation: NavigationItem[]): NavigationItem[] {
  const db = getCmsDatabase();
  db.navigation = navigation.sort((a, b) => a.order - b.order);
  saveCmsDatabase(db);
  return db.navigation;
}

export function updateSections(sections: SectionConfig[]): SectionConfig[] {
  const db = getCmsDatabase();
  db.sections = sections.sort((a, b) => a.order - b.order);
  saveCmsDatabase(db);
  return db.sections;
}

export function saveEventProject(event: EventProject): EventProject[] {
  const db = getCmsDatabase();
  const index = db.events.findIndex((e) => e.id === event.id);
  if (index >= 0) {
    db.events[index] = event;
  } else {
    db.events.push(event);
  }
  db.events.sort((a, b) => a.order - b.order);
  saveCmsDatabase(db);
  return db.events;
}

export function deleteEventProject(id: string): EventProject[] {
  const db = getCmsDatabase();
  db.events = db.events.filter((e) => e.id !== id);
  saveCmsDatabase(db);
  return db.events;
}

export function saveService(service: ServicePackage): ServicePackage[] {
  const db = getCmsDatabase();
  const index = db.services.findIndex((s) => s.id === service.id);
  if (index >= 0) {
    db.services[index] = service;
  } else {
    db.services.push(service);
  }
  db.services.sort((a, b) => a.order - b.order);
  saveCmsDatabase(db);
  return db.services;
}

export function deleteService(id: string): ServicePackage[] {
  const db = getCmsDatabase();
  db.services = db.services.filter((s) => s.id !== id);
  saveCmsDatabase(db);
  return db.services;
}

export function saveTestimonial(testimonial: Testimonial): Testimonial[] {
  const db = getCmsDatabase();
  const index = db.testimonials.findIndex((t) => t.id === testimonial.id);
  if (index >= 0) {
    db.testimonials[index] = testimonial;
  } else {
    db.testimonials.push(testimonial);
  }
  db.testimonials.sort((a, b) => a.order - b.order);
  saveCmsDatabase(db);
  return db.testimonials;
}

export function deleteTestimonial(id: string): Testimonial[] {
  const db = getCmsDatabase();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  saveCmsDatabase(db);
  return db.testimonials;
}

export function addInquiry(inquiryData: Omit<VIPInquiry, 'id' | 'createdAt' | 'status'>): VIPInquiry {
  const db = getCmsDatabase();
  const newInquiry: VIPInquiry = {
    ...inquiryData,
    id: `inq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  db.inquiries.unshift(newInquiry);
  saveCmsDatabase(db);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: VIPInquiry['status']): VIPInquiry[] {
  const db = getCmsDatabase();
  const item = db.inquiries.find((i) => i.id === id);
  if (item) {
    item.status = status;
    saveCmsDatabase(db);
  }
  return db.inquiries;
}

export function resetCmsToDefault(): CmsDatabase {
  saveCmsDatabase(JSON.parse(JSON.stringify(initialCmsData)));
  return getCmsDatabase();
}
