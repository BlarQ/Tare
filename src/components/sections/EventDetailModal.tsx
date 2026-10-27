'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EventProject } from '@/types/cms';
import { X, Calendar, MapPin, Users, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface EventDetailModalProps {
  event: EventProject | null;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!event) return null;

  const currentCover = activeImage || event.coverImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-4 sm:p-6 md:p-10 bg-[#100904]/90 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#100904] border border-[#40372e] text-[#ffedd7] rounded-[12px] shadow-2xl overflow-hidden my-auto max-h-[92dvh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#40372e] flex items-center justify-between bg-[#100904] sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="px-2.5 py-0.5 bg-[#382416] border border-[#40372e] text-[#ffedd7] font-display-halyard text-[9px] sm:text-[10px] uppercase rounded-[22.5px] shrink-0">
              {event.category}
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-[#6c5f51] truncate">
              {event.year} · {event.location}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-[#ffedd7]/70 hover:text-[#ffedd7] bg-[#382416]/50 hover:bg-[#382416] rounded-[22.5px] transition-colors shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 xs:p-6 sm:p-8 md:p-10 overflow-y-auto mobile-scroll-container space-y-6 sm:space-y-8">
          {/* Header Title */}
          <div>
            <h2 className="fluid-h2 font-display-halyard text-[#ffedd7] uppercase leading-[0.92]">
              {event.title}
            </h2>
            <p className="font-mono text-[10px] sm:text-xs text-[#dc5000] uppercase mt-1 sm:mt-2">
              {event.subtitle}
            </p>
          </div>

          {/* Main Showcase Hero Image */}
          <div className="relative w-full h-[200px] xs:h-[260px] sm:h-[360px] md:h-[440px] rounded-[10px] sm:rounded-[12px] overflow-hidden border border-[#40372e] group">
            <Image
              src={currentCover}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100904]/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex items-end justify-between">
              <div className="bg-[#100904]/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-2 rounded-[22.5px] border border-[#40372e]">
                <span className="font-display-halyard text-[10px] sm:text-xs text-[#ffedd7]">
                  Venue: <strong>{event.venue}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {event.galleryImages && event.galleryImages.length > 1 && (
            <div>
              <div className="font-display-halyard text-[10px] sm:text-xs text-[#6c5f51] uppercase mb-2 sm:mb-3">
                Scenography Perspective Gallery
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                {event.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-16 xs:h-20 sm:h-24 rounded-[8px] overflow-hidden border transition-all ${
                      currentCover === img ? 'border-[#ffedd7] scale-95 ring-2 ring-[#dc5000]/50' : 'border-[#40372e] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-5 bg-[#382416]/30 border border-[#40372e] rounded-[10px] sm:rounded-[12px]">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dc5000] shrink-0" />
              <div>
                <div className="font-display-halyard text-[8px] sm:text-[10px] text-[#6c5f51] uppercase">Year</div>
                <div className="font-display-halyard text-[11px] sm:text-xs text-[#ffedd7]">{event.year}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dc5000] shrink-0" />
              <div>
                <div className="font-display-halyard text-[8px] sm:text-[10px] text-[#6c5f51] uppercase">Location</div>
                <div className="font-display-halyard text-[11px] sm:text-xs text-[#ffedd7] truncate max-w-[120px]">{event.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dc5000] shrink-0" />
              <div>
                <div className="font-display-halyard text-[8px] sm:text-[10px] text-[#6c5f51] uppercase">Guest Count</div>
                <div className="font-display-halyard text-[11px] sm:text-xs text-[#ffedd7]">{event.guestCount}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dc5000] shrink-0" />
              <div>
                <div className="font-display-halyard text-[8px] sm:text-[10px] text-[#6c5f51] uppercase">Scope Tier</div>
                <div className="font-display-halyard text-[11px] sm:text-xs text-[#ffedd7]">{event.budgetTier}</div>
              </div>
            </div>
          </div>

          {/* Narrative & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8">
            <div className="md:col-span-7 space-y-2.5 sm:space-y-4">
              <h3 className="font-display-halyard text-[10px] sm:text-xs text-[#6c5f51] uppercase">
                Scenography Narrative &amp; Direction
              </h3>
              <p className="fluid-body text-[#ffedd7]/90 leading-relaxed font-normal">
                {event.description}
              </p>
            </div>

            <div className="md:col-span-5 space-y-2.5 sm:space-y-4">
              <h3 className="font-display-halyard text-[10px] sm:text-xs text-[#6c5f51] uppercase">
                Key Architectural Deliverables
              </h3>
              <ul className="space-y-2">
                {event.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs font-body-conversational text-[#ffedd7]/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#dc5000] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-4 sm:pt-6 dashed-divider flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-body-conversational text-[11px] sm:text-xs text-[#6c5f51] text-center sm:text-left">
              Seeking a bespoke sovereign atmosphere for your monumental milestone?
            </span>
            <button
              onClick={onClose}
              className="btn-pill-bark text-[11px] sm:text-xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>Explore Direct Intake</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#dc5000]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
