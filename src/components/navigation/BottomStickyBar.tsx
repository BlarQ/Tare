'use client';

import React from 'react';
import { SiteSettings } from '@/types/cms';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface BottomStickyBarProps {
  settings: SiteSettings;
}

export default function BottomStickyBar({ settings }: BottomStickyBarProps) {
  const { planner } = settings;

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Site Status & Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#100904]/95 backdrop-blur-md text-[#ffedd7] border-t border-[#40372e] px-6 sm:px-10 py-3 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Status Tag with Ember Orange Pulse Dot */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#dc5000] animate-pulse" />
          <span className="font-display-halyard text-[11px] sm:text-xs text-[#6c5f51] uppercase tracking-wider hidden sm:inline-block">
            {settings.bottomBarStatusText || 'ACCEPTING 2026/2027 COMMISSIONS'}
          </span>
          <span className="font-display-halyard text-[10px] text-[#6c5f51] uppercase tracking-wider sm:hidden">
            COMMISSIONS OPEN
          </span>
        </div>

        {/* Center: Planner Name & Direct Booking Pill CTA */}
        <div className="flex items-center gap-4">
          <span className="font-display-halyard text-xs text-[#ffedd7] uppercase hidden md:inline-block">
            {planner.fullName}
          </span>

          <a
            href="#inquiry"
            className="btn-pill-bark text-xs py-1.5 px-4 flex items-center gap-1.5"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-3 h-3 text-[#dc5000]" />
          </a>
        </div>

        {/* Right: Scroll Prompt */}
        <button
          onClick={scrollToNext}
          className="flex items-center gap-1.5 font-display-halyard text-xs text-[#ffedd7] hover:text-[#dc5000] uppercase tracking-wider transition-colors"
        >
          <span>Scroll</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </aside>
  );
}
