'use client';

import React from 'react';
import Image from 'next/image';
import { SectionConfig, SiteSettings } from '@/types/cms';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EditorialStatementProps {
  settings: SiteSettings;
  config?: SectionConfig;
}

export default function EditorialStatementSection({ settings, config }: EditorialStatementProps) {
  return (
    <section
      id="philosophy"
      className="relative w-full bg-[#f4f3f0] text-[#1a1915] py-24 md:py-36 px-6 md:px-10 transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Kicker & Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1915]/20 pb-6 mb-16">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#82868e] tracking-widest uppercase">
              {config?.kicker || '01 / THE PHILOSOPHY'}
            </span>
          </div>
          <div className="font-mono text-xs text-[#82868e] tracking-widest uppercase">
            EDITORIAL PASTEBOARD &amp; SCENIC ARCHITECTURE
          </div>
        </div>

        {/* Magazine Editorial Scatter & Headline Interrupted by Inline Photography (DESIGN.md DNA) */}
        <div className="relative my-8 py-6">
          {/* Floating Editorial Photo 1 (Top Left) */}
          <div className="hidden lg:block absolute -top-12 left-0 w-36 h-48 bg-white p-1.5 shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-500 rounded-[2px] z-10">
            <div className="relative w-full h-full overflow-hidden rounded-[2px]">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                alt="Lake Como Floral Scenography"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating Editorial Photo 2 (Top Right) */}
          <div className="hidden lg:block absolute -top-8 right-8 w-44 h-56 bg-white p-1.5 shadow-md transform rotate-4 hover:rotate-0 transition-transform duration-500 rounded-[2px] z-10">
            <div className="relative w-full h-full overflow-hidden rounded-[2px]">
              <Image
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop"
                alt="Palais Garnier Banquet"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating Editorial Photo 3 (Bottom Right) */}
          <div className="hidden lg:block absolute -bottom-10 right-28 w-36 h-44 bg-white p-1.5 shadow-md transform -rotate-2 hover:rotate-0 transition-transform duration-500 rounded-[2px] z-10">
            <div className="relative w-full h-full overflow-hidden rounded-[2px]">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
                alt="Monaco Soirée Table"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Core Signature Headline with Inline Image (from DESIGN.md) */}
          <div className="max-w-4xl mx-auto text-center lg:text-left relative z-20">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-[-0.03em] text-[#1a1915]">
              We craft{' '}
              <span className="inline-block align-middle mx-2 my-1 w-16 sm:w-20 md:w-24 h-9 sm:h-11 md:h-13 relative rounded-[2px] overflow-hidden border border-[#1a1915] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop"
                  alt="Floral detail"
                  fill
                  className="object-cover"
                />
              </span>{' '}
              ephemeral worlds where architectural grandeur meets{' '}
              <span className="italic font-light text-neutral-600">intimate human devotion.</span>
            </h2>
          </div>
        </div>

        {/* Two-Column Editorial Manifesto & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20 pt-12 border-t border-[#1a1915]/15">
          <div className="lg:col-span-5">
            <div className="font-mono text-xs text-[#82868e] uppercase tracking-widest mb-3">
              The Curatorial Vision
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#1a1915] font-normal leading-snug">
              Every celebration is a private exhibition of light, acoustics, and couture floristry.
            </h3>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <p className="font-serif text-lg md:text-xl text-[#1a1915]/90 leading-relaxed">
              Founded on the principles of haute couture scenography, {settings.brandName} merges 
              contemporary spatial geometry with classical opulence. We reject generic templates; each 
              ballroom, private island, or historic amphitheater is mapped in 3D WebGL before a single stem is placed.
            </p>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div>
                <div className="font-mono text-xs text-[#82868e] uppercase">Bespoke Blueprint</div>
                <div className="font-sans font-semibold text-sm text-[#1a1915] mt-1">Zero Reused Concepts</div>
              </div>
              <div className="w-px h-8 bg-[#1a1915]/20" />
              <div>
                <div className="font-mono text-xs text-[#82868e] uppercase">Confidentiality</div>
                <div className="font-sans font-semibold text-sm text-[#1a1915] mt-1">Strict NDA Protection</div>
              </div>
              <div className="w-px h-8 bg-[#1a1915]/20" />
              <div>
                <div className="font-mono text-xs text-[#82868e] uppercase">Global Reach</div>
                <div className="font-sans font-semibold text-sm text-[#1a1915] mt-1">Europe · Americas · Asia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
