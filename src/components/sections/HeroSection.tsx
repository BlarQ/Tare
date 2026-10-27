'use client';

import React from 'react';
import Image from 'next/image';
import { SiteSettings, SectionConfig } from '@/types/cms';
import { ArrowDown, Play, Sparkles, ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  settings: SiteSettings;
  config?: SectionConfig;
}

export default function HeroSection({ settings, config }: HeroSectionProps) {
  const { planner } = settings;

  return (
    <section className="relative w-full min-h-screen bg-[#100904] text-[#ffedd7] flex flex-col justify-between pt-28 md:pt-36 pb-16 px-6 sm:px-10 overflow-hidden">
      {/* Top Lockup: Tagline & Category */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
          <span className="font-display-halyard text-xs tracking-widest text-[#ffedd7]/90 uppercase">
            {config?.kicker || 'ARCHITECT OF TRANSCENDENT WEDDINGS & MONUMENTAL GALAS.'}
          </span>
        </div>

        <div className="font-display-halyard text-xs text-[#6c5f51] tracking-wider uppercase">
          {settings.location || 'PARIS · LAKE COMO · NEW YORK'}
        </div>
      </div>

      {/* Center Theatrical Display: Massive Wordmark (0.9 Line-height from DESIGN-3.md) */}
      <div className="max-w-7xl mx-auto w-full my-auto py-10 z-10">
        <div className="max-w-4xl">
          {/* Badge Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#382416]/50 border border-[#40372e] rounded-[22.5px] mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
            <span className="font-display-halyard text-[11px] text-[#ffedd7] tracking-wider uppercase">
              {config?.badgeText || '12 YEARS DIRECTION · PARIS / COMO / NYC'}
            </span>
          </div>

          {/* Sculptural Stacking Display Headline (51px-80px uppercase, 0.9 line-height) */}
          <h1 className="font-display-halyard text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#ffedd7] uppercase mb-6 leading-[0.88] select-none">
            <span className="block">{planner.fullName.split(' ')[0]}</span>
            <span className="block text-[#6c5f51] -mt-1 sm:-mt-2">
              {planner.fullName.split(' ').slice(1).join(' ') || 'LAURENT'}
            </span>
          </h1>

          {/* Mixed-Case Conversational Body Copy (DESIGN-3.md: 29px / 1.26 line-height) */}
          <p className="font-body-conversational text-xl sm:text-2xl md:text-3xl text-[#ffedd7]/90 max-w-2xl leading-snug mb-8">
            {config?.subtitle ||
              'Designing and directing ephemeral worlds for ultra-luxury weddings, private galas, and monumental celebrations worldwide.'}
          </p>

          {/* Action Buttons: Pill CTA + Ghost Outline Button */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#inquiry"
              className="btn-pill-bark flex items-center gap-2"
            >
              <span>Book Private Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#dc5000]" />
            </a>

            <a
              href="#about"
              className="btn-ghost-cream flex items-center gap-2"
            >
              <span>Explore The Planner</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row: Hero Info Card (12px Radius) & Video Thumbnail Card */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end z-10 pt-6 dashed-divider">
        {/* Left: Semi-Transparent Info Card (12px Radius from DESIGN-3.md) */}
        <div className="md:col-span-7 bg-[#100904]/85 border border-[#40372e] p-5 rounded-[12px] backdrop-blur-md">
          <div className="font-display-halyard text-xs text-[#ffedd7] uppercase mb-2">
            CURATED BY {planner.fullName.toUpperCase()}, PRINCIPAL SCENOGRAPHER
          </div>
          <div className="dashed-divider my-2" />
          <p className="font-body-conversational text-sm text-[#ffedd7]/80">
            Accepting strictly 12 private wedding and gala commissions per calendar year to guarantee absolute intimacy, bespoke fabrication, and flawless execution.
          </p>
        </div>

        {/* Right: Video / Event Highlight Thumbnail Card (12px Radius from DESIGN-3.md) */}
        <div className="md:col-span-5 flex justify-start md:justify-end">
          <a
            href="#masterpieces"
            className="group relative w-full sm:w-72 h-28 bg-[#382416] border border-[#40372e] rounded-[12px] p-3 flex items-center gap-4 hover:border-[#ffedd7] transition-all overflow-hidden"
          >
            <div className="relative w-20 h-full rounded-[8px] overflow-hidden bg-black shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop"
                alt="Highlight reel"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-[#ffedd7] text-[#100904] flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-display-halyard text-[11px] text-[#ffedd7] uppercase">
                2026 ARCHIVES REEL
              </span>
              <span className="text-[10px] font-mono text-[#6c5f51] uppercase mt-0.5">
                Villa Balbiano &amp; Palais Garnier
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
