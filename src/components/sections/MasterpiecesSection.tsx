'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EventProject, SectionConfig, SiteSettings } from '@/types/cms';
import EventDetailModal from './EventDetailModal';
import { ArrowUpRight } from 'lucide-react';

interface MasterpiecesSectionProps {
  events: EventProject[];
  config?: SectionConfig;
  settings: SiteSettings;
}

export default function MasterpiecesSection({ events, config, settings }: MasterpiecesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<EventProject | null>(null);

  const categories = ['ALL', ...Array.from(new Set(events.map((e) => e.category)))];

  const filteredEvents =
    selectedCategory === 'ALL'
      ? events
      : events.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="masterpieces" className="w-full bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 dashed-divider pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
              <span className="font-display-halyard text-xs text-[#ffedd7] uppercase tracking-wider">
                {config?.kicker || '03 / CURATED EVENT PORTFOLIO'}
              </span>
            </div>
            <h2 className="font-display-halyard text-4xl sm:text-6xl text-[#ffedd7] uppercase leading-[0.9]">
              {config?.title || 'CURATED MASTERPIECES'}
            </h2>
          </div>

          <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/80 max-w-md">
            {config?.subtitle ||
              'A catalogue of ephemeral architectural spectacles designed across European palazzos and private estates.'}
          </p>
        </div>

        {/* Minimal Pill Category Filters from DESIGN-3.md */}
        <div className="flex flex-wrap items-center gap-2 dashed-divider pt-4 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-display-halyard text-xs uppercase tracking-wider rounded-[22.5px] transition-all ${
                selectedCategory === cat
                  ? 'bg-[#382416] text-[#ffedd7] border border-[#ffedd7]'
                  : 'bg-transparent text-[#6c5f51] border border-[#40372e] hover:border-[#6c5f51] hover:text-[#ffedd7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masterpieces Showcase (12px Card Radius from DESIGN-3.md) */}
        <div className="space-y-24">
          {filteredEvents.map((event, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={event.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Card (12px Radius) */}
                <div
                  onClick={() => setSelectedEvent(event)}
                  className={`lg:col-span-7 relative h-[360px] sm:h-[480px] bg-[#382416] rounded-[12px] border border-[#40372e] overflow-hidden cursor-pointer group ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4 bg-[#100904]/90 backdrop-blur-md text-[#ffedd7] font-display-halyard text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-[22.5px] border border-[#40372e]">
                    {event.category}
                  </div>

                  {/* Year & Location */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="bg-[#100904]/90 backdrop-blur-md px-3 py-1 font-mono text-xs text-[#ffedd7] uppercase rounded-[22.5px] border border-[#40372e]">
                      {event.location}
                    </span>
                    <span className="bg-[#382416]/90 backdrop-blur-md px-3 py-1 font-mono text-xs text-[#ffedd7] rounded-[22.5px] border border-[#40372e]">
                      {event.year}
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-5 flex flex-col justify-center space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  {/* Kicker label */}
                  <div className="font-display-halyard text-xs text-[#dc5000] uppercase tracking-wider">
                    {event.venue}
                  </div>

                  {/* Display Headline at 41px uppercase with 0.9 line-height */}
                  <h3
                    onClick={() => setSelectedEvent(event)}
                    className="font-display-halyard text-3xl sm:text-4xl text-[#ffedd7] uppercase leading-[0.9] hover:text-[#dc5000] transition-colors cursor-pointer"
                  >
                    {event.title}
                  </h3>

                  {/* Conversational Excerpt at 29px / 1.26 from DESIGN-3.md */}
                  <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/85 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Specs Strip */}
                  <div className="grid grid-cols-2 gap-4 pt-4 dashed-divider">
                    <div>
                      <div className="font-display-halyard text-[10px] text-[#6c5f51] uppercase">Guest Capacity</div>
                      <div className="font-display-halyard text-xs text-[#ffedd7] mt-0.5">{event.guestCount}</div>
                    </div>
                    <div>
                      <div className="font-display-halyard text-[10px] text-[#6c5f51] uppercase">Production Scope</div>
                      <div className="font-display-halyard text-xs text-[#dc5000] mt-0.5">{event.budgetTier}</div>
                    </div>
                  </div>

                  {/* Ghost Action Button from DESIGN-3.md */}
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="btn-ghost-cream inline-flex items-center gap-2"
                    >
                      <span>View Full Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#dc5000]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Study Modal */}
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}
