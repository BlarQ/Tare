'use client';

import React from 'react';
import Image from 'next/image';
import { SiteSettings, SectionConfig } from '@/types/cms';
import { ArrowUpRight, MapPin } from 'lucide-react';

interface AboutPlannerSectionProps {
  settings: SiteSettings;
  config?: SectionConfig;
}

export default function AboutPlannerSection({ settings, config }: AboutPlannerSectionProps) {
  const { planner } = settings;

  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e] flex flex-col justify-between"
    >
      <div className="max-w-7xl mx-auto w-full space-y-20">
        {/* Top Kicker Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dashed-divider pt-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
            <span className="font-display-halyard text-xs tracking-wider text-[#ffedd7] uppercase">
              {config?.kicker || '01 / THE PLANNER & SPATIAL ARCHITECT'}
            </span>
          </div>

          <div className="font-display-halyard text-xs text-[#6c5f51] uppercase">
            PARISIAN HERITAGE · GLOBAL REACH
          </div>
        </div>

        {/* Void-Mode 3-Column Layout from DESIGN-3.md */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading at 41px uppercase, line-height 0.9 */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="font-display-halyard text-3xl sm:text-4xl md:text-5xl text-[#ffedd7] uppercase leading-[0.9]">
              ISN&apos;T JUST AN EVENT PLANNER.
            </h2>
            <div className="dashed-divider" />
            <p className="font-display-halyard text-xs text-[#dc5000] uppercase tracking-wider">
              ARCHITECT OF SPATIAL EMOTION &amp; TIMELESS SYMPHONY
            </p>
          </div>

          {/* Center Column: Portrait in Context / Editorial Card (12px radius from DESIGN-3.md) */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm h-[400px] bg-[#382416] border border-[#40372e] rounded-[12px] p-2.5 shadow-2xl overflow-hidden group">
              <div className="relative w-full h-full rounded-[8px] overflow-hidden">
                <Image
                  src={planner.portraitImage}
                  alt={planner.fullName}
                  fill
                  className="object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Tag Overlays */}
              <div className="absolute top-5 left-5 bg-[#100904]/90 backdrop-blur-md px-3 py-1 font-display-halyard text-[10px] uppercase text-[#ffedd7] rounded-[22.5px] border border-[#40372e]">
                {planner.title}
              </div>

              <div className="absolute bottom-5 right-5 bg-[#100904]/90 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase text-[#ffedd7] rounded-[22.5px] border border-[#40372e] flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#dc5000]" />
                {settings.location}
              </div>
            </div>
          </div>

          {/* Right Column: Conversational Body Copy at 29px / 1.26 from DESIGN-3.md */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <p className="font-body-conversational text-lg sm:text-xl md:text-2xl text-[#ffedd7]/90 leading-snug">
              {planner.curatorBio}
            </p>

            <div className="p-4 bg-[#382416]/40 border border-[#40372e] rounded-[12px]">
              <div className="font-display-halyard text-xs text-[#ffedd7] uppercase mb-1">
                Signature Aesthetic:
              </div>
              <p className="font-body-conversational text-xs text-[#ffedd7]/80">
                {planner.signatureStyle}
              </p>
            </div>

            <div>
              <a
                href="#inquiry"
                className="btn-ghost-cream inline-flex items-center gap-2"
              >
                <span>Commission {planner.fullName.split(' ')[0]}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#dc5000]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Specialties Tags Strip */}
        <div className="dashed-divider pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="font-display-halyard text-xs text-[#6c5f51] uppercase">
            Core Planning Disciplines:
          </div>
          <div className="flex flex-wrap gap-2">
            {planner.specialties.map((spec, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 bg-[#382416]/60 border border-[#40372e] text-[11px] font-display-halyard uppercase text-[#ffedd7] rounded-[22.5px]"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
