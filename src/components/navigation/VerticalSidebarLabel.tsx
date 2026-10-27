'use client';

import React from 'react';

export default function VerticalSidebarLabel({ brandName = 'AURELIA LAURENT — 2026 EDITION' }: { brandName?: string }) {
  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex items-center gap-3 select-none">
      <div className="w-1.5 h-1.5 rounded-full bg-[#dc5000] animate-pulse" />
      <span className="vertical-sidebar-text font-mono text-[10px] tracking-[0.25em] uppercase text-[#6c5f51]">
        {brandName} · SCENOGRAPHY &amp; EVENT DIRECTION
      </span>
    </div>
  );
}
