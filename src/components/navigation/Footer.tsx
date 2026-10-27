'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/types/cms';
import { ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const { planner } = settings;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#100904] text-[#ffedd7] pt-20 pb-28 px-6 sm:px-10 border-t border-[#40372e]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Massive Wordmark from DESIGN-3.md (51px+ Uppercase, 0.9 Line-height) */}
        <div className="dashed-divider pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="font-display-halyard text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#ffedd7] uppercase leading-[0.88] select-none">
            {planner.fullName}
          </h2>

          <button
            onClick={scrollToTop}
            className="btn-ghost-cream self-start md:self-auto flex items-center gap-2 text-xs py-2 px-4"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#dc5000]" />
          </button>
        </div>

        {/* 4-Column Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 dashed-divider pt-10">
          {/* Col 1: Studio Presence */}
          <div>
            <div className="font-display-halyard text-xs text-[#6c5f51] uppercase mb-3">
              Studio Coordinates
            </div>
            <p className="font-body-conversational text-sm text-[#ffedd7]/85 leading-relaxed">
              Place Vendôme, Paris Ier<br />
              Via Bellinzona, Lake Como<br />
              Madison Avenue, New York NY
            </p>
          </div>

          {/* Col 2: Direct Communications */}
          <div>
            <div className="font-display-halyard text-xs text-[#6c5f51] uppercase mb-3">
              Concierge Communications
            </div>
            <div className="space-y-1 font-mono text-xs text-[#ffedd7]/90">
              <div>{settings.planner.fullName}</div>
              <div>{settings.contactEmail} <span aria-hidden="true">•</span> {settings.contactPhone}</div>
            </div>
          </div>

          {/* Col 3: Archives */}
          <div>
            <div className="font-display-halyard text-xs text-[#6c5f51] uppercase mb-3">
              Digital Archives
            </div>
            <div className="flex flex-col gap-2 font-display-halyard text-xs text-[#ffedd7]/70">
              <a href={settings.socialLinks.instagram || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffedd7] hover:underline transition-all">
                Instagram / @aurelialaurent
              </a>
              <a href={settings.socialLinks.pinterest || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffedd7] hover:underline transition-all">
                Pinterest / Curated Moods
              </a>
              <a href={settings.socialLinks.vimeo || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffedd7] hover:underline transition-all">
                Vimeo / 4K Scenography Films
              </a>
            </div>
          </div>

          {/* Col 4: CMS Admin Direct Link */}
          <div>
            <div className="font-display-halyard text-xs text-[#6c5f51] uppercase mb-3">
              Planner Portal
            </div>
            <Link
              href="/admin"
              className="btn-ghost-cream inline-flex items-center gap-2 text-xs py-1.5 px-3.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#dc5000]" />
              Manage Dynamic CMS
            </Link>
            <p className="font-body-conversational text-xs text-[#6c5f51] mt-2">
              Instant access for bio, stats, portfolio &amp; inquiries.
            </p>
          </div>
        </div>

        {/* Bottom Credits & Ember Accent from DESIGN-3.md */}
        <div className="dashed-divider pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#6c5f51]">
          <div>{settings.footerCopyright}</div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>DESIGN SYSTEM:</span>
            <span className="text-[#dc5000]">ORYZO / LUSION DARKROOM EDITORIAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
