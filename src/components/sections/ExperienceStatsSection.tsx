'use client';

import React, { useState } from 'react';
import { SiteSettings, SectionConfig } from '@/types/cms';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface ExperienceStatsSectionProps {
  settings: SiteSettings;
  config?: SectionConfig;
}

export default function ExperienceStatsSection({ settings, config }: ExperienceStatsSectionProps) {
  const { planner } = settings;
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  return (
    <section
      id="experience"
      className="w-full min-h-screen bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 dashed-divider pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
              <span className="font-display-halyard text-xs text-[#ffedd7] uppercase tracking-wider">
                {config?.kicker || '02 / EXPERIENCE & PROVEN TRACK RECORD'}
              </span>
            </div>
            <h2 className="font-display-halyard text-4xl sm:text-6xl text-[#ffedd7] uppercase leading-[0.9]">
              {config?.title || 'CAREER EXPERIENCE'}
            </h2>
          </div>

          <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/80 max-w-md">
            {config?.subtitle ||
              'A documented history of orchestrating high-discretion celebrations for discerning patrons worldwide.'}
          </p>
        </div>

        {/* 4 Quantitative Metric Cards from DESIGN-3.md */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#382416]/40 border border-[#40372e] rounded-[12px] flex flex-col justify-between hover:border-[#ffedd7] transition-all">
            <div className="font-display-halyard text-5xl sm:text-6xl text-[#ffedd7] leading-none mb-4">
              {planner.experienceYears}+
            </div>
            <div>
              <div className="font-display-halyard text-xs text-[#ffedd7] uppercase">
                Years in Direction
              </div>
              <div className="dashed-divider my-2" />
              <p className="font-body-conversational text-xs text-[#6c5f51]">
                Mastering spatial lighting and luxury logistics since 2014.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#382416]/40 border border-[#40372e] rounded-[12px] flex flex-col justify-between hover:border-[#ffedd7] transition-all">
            <div className="font-display-halyard text-5xl sm:text-6xl text-[#ffedd7] leading-none mb-4">
              {planner.eventsOrganized}+
            </div>
            <div>
              <div className="font-display-halyard text-xs text-[#ffedd7] uppercase">
                Bespoke Events Executed
              </div>
              <div className="dashed-divider my-2" />
              <p className="font-body-conversational text-xs text-[#6c5f51]">
                Nuptials, high-jewelry balls, private island celebrations.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#382416]/40 border border-[#40372e] rounded-[12px] flex flex-col justify-between hover:border-[#ffedd7] transition-all">
            <div className="font-display-halyard text-5xl sm:text-6xl text-[#ffedd7] leading-none mb-4">
              {planner.countriesWorked}
            </div>
            <div>
              <div className="font-display-halyard text-xs text-[#ffedd7] uppercase">
                Global Destinations
              </div>
              <div className="dashed-divider my-2" />
              <p className="font-body-conversational text-xs text-[#6c5f51]">
                France, Italy, Switzerland, Japan, USA, UAE, Greece.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#382416]/40 border border-[#40372e] rounded-[12px] flex flex-col justify-between hover:border-[#ffedd7] transition-all">
            <div className="font-display-halyard text-5xl sm:text-6xl text-[#ffedd7] leading-none mb-4">
              100%
            </div>
            <div>
              <div className="font-display-halyard text-xs text-[#ffedd7] uppercase">
                Custom Scenography
              </div>
              <div className="dashed-divider my-2" />
              <p className="font-body-conversational text-xs text-[#6c5f51]">
                Zero reused blueprints; every celebration is uniquely engineered.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Career Milestones Timeline from DESIGN-3.md */}
        <div className="bg-[#100904] border border-[#40372e] rounded-[12px] p-6 sm:p-10">
          <div className="flex items-center justify-between dashed-divider pb-4 mb-8">
            <div className="font-display-halyard text-sm text-[#ffedd7] uppercase">
              Selected Career Milestones &amp; Historic Commissions
            </div>
            <span className="font-mono text-xs text-[#6c5f51] uppercase hidden sm:inline-block">
              2018 — 2026 ARCHIVES
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Milestones Selector */}
            <div className="lg:col-span-5 space-y-2">
              {planner.milestones.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMilestone(idx)}
                  className={`w-full text-left p-4 rounded-[12px] transition-all border ${
                    selectedMilestone === idx
                      ? 'bg-[#382416] text-[#ffedd7] border-[#ffedd7]'
                      : 'bg-transparent text-[#6c5f51] border-[#40372e] hover:border-[#6c5f51] hover:text-[#ffedd7]'
                  }`}
                >
                  <div className="font-display-halyard text-[11px] uppercase tracking-wider mb-1">
                    {m.year} · {m.location}
                  </div>
                  <div className="font-display-halyard text-sm leading-snug">
                    {m.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Right Milestone Spotlight Detail */}
            <div className="lg:col-span-7 bg-[#382416]/30 border border-[#40372e] p-6 sm:p-8 rounded-[12px] flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#382416] text-[#ffedd7] font-display-halyard text-[10px] uppercase rounded-[22.5px] border border-[#40372e]">
                    YEAR {planner.milestones[selectedMilestone].year}
                  </span>
                  <span className="font-mono text-xs text-[#6c5f51] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#dc5000]" />
                    {planner.milestones[selectedMilestone].location}
                  </span>
                </div>

                <h4 className="font-display-halyard text-2xl text-[#ffedd7] uppercase mb-2">
                  {planner.milestones[selectedMilestone].title}
                </h4>

                <div className="font-mono text-xs text-[#dc5000] mb-6">
                  Role: {planner.milestones[selectedMilestone].role}
                </div>

                <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/90 leading-relaxed">
                  {planner.milestones[selectedMilestone].description}
                </p>
              </div>

              <div className="pt-6 dashed-divider mt-6 flex items-center justify-between">
                <span className="font-mono text-xs text-[#6c5f51]">
                  Featured in Client Dossier
                </span>
                <a
                  href="#masterpieces"
                  className="font-display-halyard text-xs text-[#ffedd7] hover:text-[#dc5000] uppercase tracking-wider flex items-center gap-1.5"
                >
                  View Case Study Photos →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
