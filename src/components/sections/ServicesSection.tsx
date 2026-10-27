'use client';

import React from 'react';
import { ServicePackage, SectionConfig, SiteSettings } from '@/types/cms';
import { Check, ArrowUpRight, Clock } from 'lucide-react';

interface ServicesSectionProps {
  services: ServicePackage[];
  config?: SectionConfig;
  settings: SiteSettings;
}

export default function ServicesSection({ services, config, settings }: ServicesSectionProps) {
  return (
    <section id="services" className="w-full bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 dashed-divider pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
              <span className="font-display-halyard text-xs text-[#ffedd7] uppercase tracking-wider">
                {config?.kicker || '05 / BESPOKE PACKAGES & PLANNING SERVICES'}
              </span>
            </div>
            <h2 className="font-display-halyard text-4xl sm:text-6xl text-[#ffedd7] uppercase leading-[0.9]">
              {config?.title || 'PLANNING PACKAGES'}
            </h2>
          </div>

          <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/80 max-w-md">
            {config?.subtitle ||
              'From complete end-to-end wedding direction to specialized spatial scenography and destination VIP logistics.'}
          </p>
        </div>

        {/* 3-Tier Packages Grid (12px radius from DESIGN-3.md) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`p-8 rounded-[12px] flex flex-col justify-between transition-all duration-300 relative group ${
                service.isFeatured
                  ? 'bg-[#382416] border border-[#ffedd7] shadow-2xl'
                  : 'bg-[#382416]/40 border border-[#40372e] hover:border-[#6c5f51]'
              }`}
            >
              {service.isFeatured && (
                <div className="absolute -top-3 left-6 bg-[#100904] text-[#ffedd7] border border-[#ffedd7] font-display-halyard text-[10px] uppercase px-3 py-1 rounded-[22.5px]">
                  {service.tierBadge || 'PREMIER SCOPE'}
                </div>
              )}

              <div>
                <div className="font-display-halyard text-xs text-[#6c5f51] uppercase mb-2">
                  TIER 0{idx + 1}
                </div>
                <h3 className="font-display-halyard text-2xl text-[#ffedd7] uppercase leading-tight mb-2">
                  {service.title}
                </h3>
                <p className="font-body-conversational text-sm text-[#dc5000] mb-6">
                  {service.tagline}
                </p>

                <p className="font-body-conversational text-sm text-[#ffedd7]/85 leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-3 pt-4 dashed-divider mb-8">
                  <div className="font-display-halyard text-[11px] text-[#6c5f51] uppercase">
                    Included Scenography Deliverables:
                  </div>
                  {service.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-body-conversational text-[#ffedd7]/90">
                      <Check className="w-3.5 h-3.5 text-[#dc5000] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Specs & Action */}
              <div className="pt-6 dashed-divider space-y-4">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#6c5f51]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#dc5000]" />
                    {service.timeline}
                  </span>
                </div>

                <div className="font-display-halyard text-xs text-[#ffedd7]">
                  {service.investmentTier}
                </div>

                <a
                  href="#inquiry"
                  className={`w-full py-3 text-center font-display-halyard text-xs uppercase tracking-wider rounded-[22.5px] transition-all flex items-center justify-center gap-2 ${
                    service.isFeatured
                      ? 'bg-[#100904] text-[#ffedd7] border border-[#ffedd7] hover:bg-[#ffedd7] hover:text-[#100904]'
                      : 'btn-ghost-cream'
                  }`}
                >
                  <span>Reserve This Scope</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#dc5000]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
