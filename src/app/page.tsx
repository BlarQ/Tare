import React from 'react';
import { getCmsDatabase } from '@/lib/cms-store';
import { fetchCmsFromSupabase, isSupabaseConfigured } from '@/lib/supabase';
import PortfolioSite from '@/components/portfolio/PortfolioSite';
import { tarePortfolioContent } from '@/data/tare-portfolio';
import { CmsDatabase, SiteSettings } from '@/types/cms';

// Ensure fresh CMS data on request
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let cmsData = null;

  if (isSupabaseConfigured()) {
    try {
      cmsData = await fetchCmsFromSupabase();
    } catch (err) {
      console.warn('Supabase fetch on SSR encountered an issue, using local fallback:', err);
    }
  }

  const stored = cmsData || getCmsDatabase();
  const contentSettings = tarePortfolioContent.settings;
  const contentPlanner = contentSettings.planner;
  const rawStoredSettings = stored?.settings || {};
  const rawStoredPlanner = rawStoredSettings.planner || {};
  const legacyRecord = /zara|aurelia/i.test(`${rawStoredSettings.brandName || ''} ${rawStoredPlanner.fullName || ''}`);
  const storedSettings: Partial<SiteSettings> = legacyRecord ? {} : rawStoredSettings;
  const storedPlanner: Partial<SiteSettings['planner']> = legacyRecord ? {} : rawStoredPlanner;
  const enrichedData: CmsDatabase = {
    ...stored,
    settings: {
      ...contentSettings,
      ...storedSettings,
      brandName: contentSettings.brandName,
      shortBio: contentSettings.shortBio,
      tagline: contentSettings.tagline,
      location: contentSettings.location,
      contactEmail: contentSettings.contactEmail,
      contactPhone: contentSettings.contactPhone,
      footerCopyright: contentSettings.footerCopyright,
      socialLinks: storedSettings.socialLinks || {},
      planner: {
        ...contentPlanner,
        ...storedPlanner,
        fullName: contentPlanner.fullName,
        title: storedPlanner.title || contentPlanner.title,
        tagline: storedPlanner.tagline || contentPlanner.tagline,
        curatorBio: storedPlanner.curatorBio || contentPlanner.curatorBio,
        philosophyStatement: storedPlanner.philosophyStatement || contentPlanner.philosophyStatement,
        signatureStyle: storedPlanner.signatureStyle || contentPlanner.signatureStyle,
        specialties: storedPlanner.specialties?.length ? storedPlanner.specialties : contentPlanner.specialties,
      },
    },
    events: legacyRecord ? tarePortfolioContent.events : (stored.events?.length ? stored.events : tarePortfolioContent.events),
    services: legacyRecord ? tarePortfolioContent.services : (stored.services?.length ? stored.services : tarePortfolioContent.services),
    testimonials: legacyRecord ? tarePortfolioContent.testimonials : (stored.testimonials?.length ? stored.testimonials : tarePortfolioContent.testimonials),
  } as CmsDatabase;

  return <PortfolioSite data={enrichedData} />;
}

