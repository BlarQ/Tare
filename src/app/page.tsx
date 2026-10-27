import React from 'react';
import { getCmsDatabase } from '@/lib/cms-store';
import { fetchCmsFromSupabase, isSupabaseConfigured } from '@/lib/supabase';
import PortfolioSite from '@/components/portfolio/PortfolioSite';

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

  return <PortfolioSite data={cmsData || getCmsDatabase()} />;
}

