'use client';

import React from 'react';
import { Testimonial, SectionConfig, SiteSettings } from '@/types/cms';
import { Quote } from 'lucide-react';

interface PressTestimonialsSectionProps {
  testimonials: Testimonial[];
  config?: SectionConfig;
  settings: SiteSettings;
}

export default function PressTestimonialsSection({
  testimonials,
  config,
  settings
}: PressTestimonialsSectionProps) {
  return (
    <section id="press" className="w-full bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 dashed-divider pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
              <span className="font-display-halyard text-xs text-[#ffedd7] uppercase tracking-wider">
                {config?.kicker || '07 / ACCLAIM & CRITICAL REVIEWS'}
              </span>
            </div>
            <h2 className="font-display-halyard text-4xl sm:text-6xl text-[#ffedd7] uppercase leading-[0.9]">
              {config?.title || 'CLIENT REVIEWS & PRESS'}
            </h2>
          </div>

          <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/80 max-w-md">
            {config?.subtitle ||
              'Reflections from couples, jewelry houses, and global architectural chronicles.'}
          </p>
        </div>

        {/* Press Outlets Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 dashed-divider text-center">
          {['VOGUE WEDDINGS', "HARPER'S BAZAAR", 'ARCHITECTURAL DIGEST', 'BRIDES MAGAZINE'].map((press, i) => (
            <div key={i} className="py-2">
              <span className="font-display-halyard text-sm sm:text-base text-[#6c5f51] hover:text-[#ffedd7] transition-colors cursor-default uppercase">
                {press}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#382416]/40 p-8 rounded-[12px] border border-[#40372e] flex flex-col justify-between hover:border-[#ffedd7] transition-all"
            >
              <div>
                <Quote className="w-6 h-6 text-[#dc5000] mb-6" />
                <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/90 leading-relaxed mb-8 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 dashed-divider flex items-center justify-between">
                <div>
                  <div className="font-display-halyard text-sm text-[#ffedd7]">{item.clientName}</div>
                  <div className="font-mono text-xs text-[#dc5000] mt-0.5">{item.eventTitle}</div>
                  <div className="font-mono text-[10px] text-[#6c5f51]">{item.location} · {item.date}</div>
                </div>

                {item.pressOutlet && (
                  <span className="font-display-halyard text-[10px] text-[#ffedd7] border border-[#40372e] px-2.5 py-1 rounded-[22.5px] uppercase">
                    {item.pressOutlet}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
