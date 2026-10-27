'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Users, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  MessageCircle,
  Sliders,
  ChevronDown,
  Layers,
  Phone,
  Mail,
  Building,
  Crown,
  RotateCcw,
  Eye
} from 'lucide-react';
import { CmsDatabase, EventProject } from '@/types/cms';
import ScrollDrivenEvent3D from '@/components/3d/ScrollDrivenEvent3D';
import EventDetailModal from '@/components/sections/EventDetailModal';
import { initialCmsData } from '@/data/initial-cms';

interface UnifiedStageFlowProps {
  initialData: CmsDatabase;
}

const STAGES = [
  { id: 'architect', index: 0, label: '01 / THE ARCHITECT', title: 'Tare Precious', category: 'Event Planning & Delivery' },
  { id: 'philosophy', index: 1, label: '02 / PHILOSOPHY', title: 'AFRICAN ROYAL SPLENDOR', category: 'Artistic Ethos' },
  { id: 'eko-atlantic', index: 2, label: '03 / EKO ATLANTIC', title: 'IMPERIAL OCEAN NUPTIALS', category: 'Curated Works' },
  { id: 'aso-rock', index: 3, label: '04 / ASO ROCK', title: 'PRESIDENTIAL INAUGURAL GALA', category: 'Curated Works' },
  { id: 'banana-island', index: 4, label: '05 / BANANA ISLAND', title: 'LAGOON 50TH SOIRÉE', category: 'Curated Works' },
  { id: 'calabar-monolith', index: 5, label: '06 / CALABAR', title: 'ROYAL MONOLITH BALL', category: 'Curated Works' },
  { id: 'dubai-nuptials', index: 6, label: '07 / DUBAI & LAGOS', title: 'TRANSCONTINENTAL NUPTIALS', category: 'Curated Works' },
  { id: 'track-record', index: 7, label: '08 / TRACK RECORD', title: '14-YEAR CAREER MILESTONES', category: 'Experience' },
  { id: 'services', index: 8, label: '09 / SERVICES', title: 'BESPOKE DIRECTION PILLARS', category: 'Capabilities' },
  { id: 'inquiry', index: 9, label: '10 / VIP INTAKE', title: 'RESERVE A COMMISSION', category: 'Concierge Booking' },
  { id: 'grand-reveal', index: 10, label: '11 / THE ASSEMBLED TABLE', title: 'FULL SCENOGRAPHY REVEAL', category: '3D Showcase' },
];

export function UnifiedStageFlow({ initialData }: UnifiedStageFlowProps) {
  const [data] = useState<CmsDatabase>(initialData);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<EventProject | null>(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);
  const [showNavMenu, setShowNavMenu] = useState<boolean>(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [inquiryForm, setInquiryForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    eventType: 'Imperial Nuptials (3-Day)',
    location: 'Lagos, Nigeria',
    guestCount: '800 VIPs',
    budgetRange: '₦150M — ₦350M',
    estimatedDate: '',
    visionNotes: '',
  });

  const totalStages = STAGES.length;

  const goToStage = useCallback((stageIndex: number) => {
    if (stageIndex >= 0 && stageIndex < totalStages) {
      setCurrentStage(stageIndex);
      setShowNavMenu(false);
    }
  }, [totalStages]);

  const nextStage = useCallback(() => {
    if (currentStage < totalStages - 1) {
      goToStage(currentStage + 1);
    }
  }, [currentStage, totalStages, goToStage]);

  const prevStage = useCallback(() => {
    if (currentStage > 0) {
      goToStage(currentStage - 1);
    }
  }, [currentStage, goToStage]);

  // Virtual Wheel & Keyboard & Touch navigation controller
  useEffect(() => {
    let lastWheelTime = 0;
    const wheelThreshold = 35; // Sensitivity threshold
    const debounceMs = 600;    // Time between stage changes

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept scroll if modal is open or user is interacting with form
      if (selectedEvent) return;
      const target = e.target as HTMLElement;
      if (target.closest('form') || target.closest('input') || target.closest('textarea') || target.closest('.allow-scroll')) return;

      // Allow natural scroll in stage container if it has overflow
      const scrollable = target.closest('.mobile-scroll-container, .overflow-y-auto') as HTMLElement | null;
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const atTop = scrollable.scrollTop <= 5;
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 5;
        if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
          return; // Let user scroll inside the content box
        }
      }

      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < debounceMs) return;

      if (e.deltaY > wheelThreshold) {
        lastWheelTime = now;
        nextStage();
      } else if (e.deltaY < -wheelThreshold) {
        lastWheelTime = now;
        prevStage();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedEvent) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextStage();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevStage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToStage(totalStages - 1);
      }
    };

    // Touch gesture handling with natural inner scroll support
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (selectedEvent) return;
      const target = e.target as HTMLElement;
      if (target.closest('form') || target.closest('input') || target.closest('textarea') || target.closest('select')) return;

      const scrollable = target.closest('.mobile-scroll-container, .overflow-y-auto') as HTMLElement | null;
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        const atTop = scrollable.scrollTop <= 5;
        const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 5;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        if ((diffY > 60 && atBottom) || (diffY < -60 && atTop)) {
          if (diffY > 0) nextStage();
          else prevStage();
        }
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) nextStage();
        else prevStage();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentStage, nextStage, prevStage, goToStage, selectedEvent, totalStages]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('submitting');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      });
      if (res.ok) {
        setInquiryStatus('success');
      } else {
        setInquiryStatus('error');
      }
    } catch {
      setInquiryStatus('error');
    }
  };

  const settings = data?.settings || initialCmsData.settings;
  const planner = settings?.planner || initialCmsData.settings.planner;
  const events = (data?.events && data.events.length > 0) ? data.events : initialCmsData.events;
  const services = (data?.services && data.services.length > 0) ? data.services : initialCmsData.services;
  const currentStageMeta = STAGES[currentStage] || STAGES[0];

  // Helper to find event by index
  const getEventByStageIndex = (stageIdx: number): EventProject | undefined => {
    const eventIndex = stageIdx - 2;
    return events[eventIndex] || events[0];
  };

  return (
    <div className="relative w-screen h-screen h-dvh overflow-hidden bg-[#100904] text-[#ffedd7] select-none font-sans">
      {/* 3D WebGL Background Canvas with Dynamic Storytelling Table Transformation */}
      <ScrollDrivenEvent3D 
        currentStage={currentStage} 
        progress={currentStage / (totalStages - 1)} 
      />

      {/* TOP HEADER NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-20 px-3 xs:px-4 sm:px-10 flex items-center justify-between border-b border-[#40372e]/50 backdrop-blur-md bg-[#100904]/60">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => goToStage(0)} 
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none"
          >
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-[#382416] border border-[#ffedd7]/30 flex items-center justify-center text-[10px] sm:text-xs font-semibold tracking-widest text-[#ffedd7] group-hover:border-[#ffedd7] transition-all shrink-0">
              {settings.monogram || 'ZO'}
            </div>
            <div>
              <div className="text-[11px] xs:text-xs sm:text-sm font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[#ffedd7] uppercase truncate max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                {settings.brandName || 'Tare Precious'}
              </div>
              <div className="text-[8px] sm:text-[9px] tracking-[0.22em] text-[#ffedd7]/50 uppercase hidden md:block font-serif">
                {settings.tagline || 'MASTER SCENOGRAPHER & LUXURY EVENT ARCHITECT'}
              </div>
            </div>
          </button>
        </div>

        {/* Current Stage Indicator Pill & Quick Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNavMenu(!showNavMenu)}
            className="flex items-center gap-1.5 xs:gap-2.5 px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-[36px] bg-[#382416]/90 border border-[#ffedd7]/30 text-[10px] xs:text-[11px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase text-[#ffedd7] hover:border-[#ffedd7] transition-all cursor-pointer shadow-lg"
          >
            <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-[#dc5000] animate-pulse shrink-0" />
            <span className="font-semibold truncate max-w-[90px] xs:max-w-[120px] sm:max-w-none">{currentStageMeta.label}</span>
            <ChevronDown size={12} className={`text-[#ffedd7]/70 transition-transform ${showNavMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Stage Jump Dropdown Menu */}
          {showNavMenu && (
            <div className="absolute right-0 top-10 sm:top-12 w-[calc(100vw-24px)] max-w-xs sm:w-72 max-h-[70vh] overflow-y-auto bg-[#100904]/95 border border-[#40372e] rounded-xl p-2 shadow-2xl backdrop-blur-xl z-50">
              <div className="px-3 py-1.5 text-[9px] tracking-widest uppercase text-[#dc5000] font-semibold border-b border-[#40372e]">
                SPATIAL STORY JUMP
              </div>
              <div className="mt-1 space-y-1">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => goToStage(s.index)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] tracking-wider uppercase flex items-center justify-between transition-all ${
                      currentStage === s.index
                        ? 'bg-[#382416] text-[#ffedd7] font-semibold'
                        : 'text-[#ffedd7]/70 hover:bg-[#382416]/40 hover:text-[#ffedd7]'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[8px] sm:text-[9px] text-[#ffedd7]/40">{s.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right CTA / Admin Links */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="https://wa.me/2348038882026?text=Hello%20Zara%20Okonjo%20Atelier,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20event%20commission."
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-[22.5px] border border-[#ffedd7]/30 text-[10px] sm:text-[11px] tracking-wider uppercase text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#382416]/30 transition-all"
          >
            <MessageCircle size={12} className="text-[#25D366]" />
            <span className="hidden md:inline">WHATSAPP VIP</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-[36px] bg-[#382416] border border-[#ffedd7]/30 text-[10px] xs:text-[11px] sm:text-xs tracking-wider uppercase text-[#ffedd7] hover:border-[#ffedd7] transition-all font-semibold"
          >
            <Sliders size={12} className="text-[#dc5000]" />
            <span className="hidden xs:inline">CMS</span>
          </Link>
        </div>
      </header>

      {/* RIGHT-EDGE VERTICAL TRACKER (DESKTOP) */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-2">
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent to-[#40372e]" />
        {STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => goToStage(s.index)}
            title={s.title}
            className="group relative flex items-center justify-center p-1 focus:outline-none"
          >
            <span 
              className={`block rounded-full transition-all duration-300 ${
                currentStage === s.index
                  ? 'w-2.5 h-2.5 bg-[#ffedd7] ring-4 ring-[#dc5000]/40'
                  : 'w-1.5 h-1.5 bg-[#ffedd7]/30 group-hover:bg-[#ffedd7]/70'
              }`}
            />
            {/* Tooltip on hover */}
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-[#100904]/90 border border-[#40372e] text-[9px] tracking-wider uppercase px-2 py-0.5 rounded whitespace-nowrap text-[#ffedd7]">
              {s.label}
            </span>
          </button>
        ))}
        <div className="w-[1px] h-6 bg-gradient-to-t from-transparent to-[#40372e]" />
      </div>

      {/* STAGE CONTENT PRESENTATION CANVAS */}
      <main className="relative w-full h-full pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-12 lg:px-20 flex items-center justify-center overflow-hidden">
        
        {/* STAGE 0: THE ARCHITECT (HER LANDING PAGE) */}
        <div 
          className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex items-center justify-center transition-all duration-700 pointer-events-auto ${
            currentStage === 0 
              ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
          }`}
        >
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-center max-h-stage mobile-scroll-container py-2">
            {/* Left Column: Big Brand Statement & Ethos */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-5">
              {/* Sculptural Headline */}
              <h1 className="fluid-h1 font-display-halyard font-medium tracking-tight text-[#ffedd7] uppercase drop-shadow-sm">
                {planner.fullName || 'Tare Precious'}
              </h1>

              <div className="text-[10px] xs:text-xs sm:text-sm tracking-[0.16em] sm:tracking-[0.24em] uppercase text-[#dc5000] font-semibold">
                {planner.title || 'PRINCIPAL EVENT ARCHITECT & LEAD SCENOGRAPHER'}
              </div>

              {/* Description Copy */}
              <p className="fluid-body text-[#ffedd7]/85 max-w-xl font-normal leading-relaxed">
                {planner.curatorBio || 
                  'Directing bespoke imperial weddings, presidential state galas, and monumental milestone celebrations across West Africa and Europe with architectural rigor.'}
              </p>

              {/* Key Stats Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 sm:py-2.5 border-y border-dashed border-[#40372e]">
                <div>
                  <div className="text-base sm:text-xl font-bold text-[#ffedd7]">{planner.experienceYears}+</div>
                  <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50 font-serif">Years Direction</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold text-[#ffedd7]">{planner.eventsOrganized}+</div>
                  <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50 font-serif">Monumental Galas</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold text-[#ffedd7]">₦15B+</div>
                  <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50 font-serif">Scope Directed</div>
                </div>
                <div>
                  <div className="text-base sm:text-xl font-bold text-[#ffedd7]">100%</div>
                  <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50 font-serif">Bespoke Discretion</div>
                </div>
              </div>

              {/* Action Pill CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <button
                  onClick={() => goToStage(1)}
                  className="px-4 xs:px-6 sm:px-8 py-2.5 sm:py-3 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#4a3220] transition-all flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <span>EXPLORE HER SPATIAL JOURNEY</span>
                  <ArrowRight size={13} className="text-[#dc5000]" />
                </button>

                <button
                  onClick={() => goToStage(9)}
                  className="px-4 xs:px-5 py-2.5 sm:py-3 rounded-[22.5px] border border-[#ffedd7]/30 text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#382416]/40 transition-all cursor-pointer"
                >
                  COMMISSION INTAKE
                </button>
              </div>
            </div>

            {/* Right Column: Her Portrait & Masterpiece Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end mt-2 lg:mt-0">
              <div className="relative w-full max-w-[260px] xs:max-w-xs sm:max-w-sm rounded-xl overflow-hidden border border-[#40372e] bg-[#100904]/80 backdrop-blur-md p-2.5 sm:p-3 shadow-2xl">
                <div className="relative w-full h-44 xs:h-52 sm:h-64 rounded-lg overflow-hidden mb-2 border border-[#40372e]/50">
                  <Image
                    src={planner.portraitImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop'}
                    alt={planner.fullName}
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100904] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] sm:text-[10px] tracking-wider uppercase text-[#ffedd7] bg-[#100904]/90 backdrop-blur-sm px-2 py-1 rounded border border-[#40372e]">
                    <span>PRINCIPAL SCENOGRAPHER</span>
                    <span className="text-[#dc5000]">VICTORIA ISLAND</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#dc5000] font-semibold">
                    ACCEPTING 2026/2027 COMMISSIONS
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#ffedd7]/75 leading-snug">
                    Strictly 10 private commissions accepted annually to ensure uncompromised architectural governance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 1: HER PHILOSOPHY & CRAFT */}
        <div 
          className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex items-center justify-center transition-all duration-700 ${
            currentStage === 1 
              ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
          }`}
        >
          <div className="max-w-5xl mx-auto w-full space-y-3.5 sm:space-y-5 max-h-stage mobile-scroll-container py-2">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#dc5000] font-semibold flex items-center gap-2">
                <Crown size={13} />
                <span>01 / HER PHILOSOPHY & ARTISTIC ETHOS</span>
              </div>
              <h2 className="fluid-h2 font-display-halyard font-medium tracking-tight uppercase text-[#ffedd7]">
                SPATIAL ARCHITECTURE MEETS NIGERIAN ROYAL SPLENDOR
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
              <div className="md:col-span-7 space-y-2.5 sm:space-y-3 fluid-body text-[#ffedd7]/85 leading-relaxed">
                <p className="text-xs sm:text-base text-[#ffedd7] italic border-l-2 border-[#dc5000] pl-3 py-0.5">
                  &ldquo;An extraordinary celebration is never merely decorated; it is composed like a sovereign symphony of light, monumental architecture, botanical couture, and deep heritage devotion.&rdquo;
                </p>
                <p className="text-[#ffedd7]/70 text-[11px] sm:text-xs md:text-sm">
                  Tare Precious brings strategic planning, disciplined production, and thoughtful delivery to complex live experiences across corporate, executive, international, and large-scale events.
                </p>
              </div>

              {/* 3 Pillars Cards */}
              <div className="md:col-span-5 space-y-2">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#382416]/60 border border-[#40372e] backdrop-blur-md">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#dc5000] font-semibold mb-0.5">
                    01. HERITAGE & ROYAL MAJESTY
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#ffedd7]/75 leading-snug">
                    Honoring ancestral ceremonial lineage with contemporary haute couture curation.
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#382416]/60 border border-[#40372e] backdrop-blur-md">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#dc5000] font-semibold mb-0.5">
                    02. 3D PHOTOMETRIC PRE-VIS
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#ffedd7]/75 leading-snug">
                    Millimeter-accurate real-time WebGL lighting simulation before physical fabrication.
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#382416]/60 border border-[#40372e] backdrop-blur-md">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#dc5000] font-semibold mb-0.5">
                    03. UNCOMPROMISING DISCRETION
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#ffedd7]/75 leading-snug">
                    Trusted by heads of state, royal families, and international titans under strict NDAs.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-dashed border-[#40372e]">
              <button
                onClick={() => goToStage(2)}
                className="px-5 sm:px-6 py-2.5 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[11px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE CURATED MASTERPIECES</span>
                <ArrowRight size={13} className="text-[#dc5000]" />
              </button>
            </div>
          </div>
        </div>

        {/* STAGES 2, 3, 4, 5, 6: THE EVENT MASTERPIECES (FLOWING ONE AFTER THE OTHER) */}
        {[2, 3, 4, 5, 6].map((stageIdx) => {
          const event = getEventByStageIndex(stageIdx);
          if (!event) return null;

          const isCurrent = currentStage === stageIdx;
          const stageNumber = stageIdx - 1;

          return (
            <div
              key={event.id}
              className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex items-center justify-center transition-all duration-700 ${
                isCurrent 
                  ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
                  : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
              }`}
            >
              <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-center max-h-stage mobile-scroll-container py-2">
                
                {/* Left Event Story & Specs */}
                <div className="lg:col-span-7 space-y-2.5 sm:space-y-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-[36px] bg-[#382416] border border-[#ffedd7]/30 text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7] font-semibold">
                      CURATED MASTERPIECE 0{stageNumber} / 05
                    </span>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#dc5000] font-semibold">
                      {event.category}
                    </span>
                  </div>

                  <h2 className="fluid-h2 font-display-halyard font-medium tracking-tight uppercase text-[#ffedd7]">
                    {event.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-[#ffedd7]/75 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#dc5000]" />
                      <span>{event.location}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-[#dc5000]" />
                      <span>{event.guestCount}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} className="text-[#dc5000]" />
                      <span>{event.budgetTier}</span>
                    </div>
                  </div>

                  <p className="fluid-body text-[#ffedd7]/80 font-normal line-clamp-3 sm:line-clamp-none">
                    {event.description}
                  </p>

                  {/* Key Deliverables Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
                    {event.deliverables.slice(0, 3).map((item, idx) => (
                      <div 
                        key={idx}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#382416]/60 border border-[#40372e] text-[9px] sm:text-[10px] tracking-wider uppercase text-[#ffedd7]/90 flex items-center gap-1"
                      >
                        <CheckCircle2 size={10} className="text-[#dc5000]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#4a3220] transition-all flex items-center gap-2 shadow-xl cursor-pointer"
                    >
                      <span>VIEW DOSSIER & ARCHIVES</span>
                      <ExternalLink size={12} className="text-[#dc5000]" />
                    </button>

                    <button
                      onClick={nextStage}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-[22.5px] border border-[#ffedd7]/30 text-[10px] sm:text-xs uppercase tracking-[0.16em] text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#382416]/40 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>NEXT EVENT</span>
                      <ArrowRight size={12} className="text-[#dc5000]" />
                    </button>
                  </div>
                </div>

                {/* Right Image Showcase Card */}
                <div className="lg:col-span-5 flex flex-col items-center lg:items-end mt-2 lg:mt-0">
                  <div 
                    onClick={() => setSelectedEvent(event)}
                    className="relative w-full max-w-[260px] xs:max-w-xs sm:max-w-sm rounded-xl overflow-hidden border border-[#40372e] bg-[#100904]/80 backdrop-blur-md p-2 sm:p-2.5 group cursor-pointer hover:border-[#ffedd7]/60 transition-all shadow-2xl"
                  >
                    <div className="relative w-full h-44 xs:h-56 sm:h-72 rounded-lg overflow-hidden border border-[#40372e]/50">
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#100904] via-transparent to-transparent opacity-70" />
                      
                      {/* Floating Category Badge */}
                      <div className="absolute top-2 left-2 bg-[#100904]/90 border border-[#40372e] px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]">
                        {event.year} ARCHIVE
                      </div>

                      {/* Click to expand hover hint */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#100904]/40 backdrop-blur-[2px]">
                        <span className="px-3 py-1 rounded-[36px] bg-[#382416] border border-[#ffedd7] text-[10px] uppercase tracking-widest font-semibold text-[#ffedd7]">
                          OPEN DOSSIER
                        </span>
                      </div>
                    </div>

                    {/* Venue tag footer */}
                    <div className="pt-2 px-1 flex items-center justify-between text-[9px] sm:text-[10px] tracking-wider uppercase text-[#ffedd7]/70">
                      <span className="truncate max-w-[180px]">{event.venue}</span>
                      <span className="text-[#dc5000] shrink-0">EXPLORE ↗</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {/* STAGE 7: 14-YEAR CAREER TRACK RECORD & MILESTONES */}
        <div 
          className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex items-center justify-center transition-all duration-700 ${
            currentStage === 7 
              ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
          }`}
        >
          <div className="max-w-5xl mx-auto w-full space-y-3 sm:space-y-4 max-h-stage mobile-scroll-container py-2">
            <div className="space-y-1 sm:space-y-1.5">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#dc5000] font-semibold flex items-center gap-2">
                <Award size={13} />
                <span>03 / 14-YEAR CAREER TRACK RECORD</span>
              </div>
              <h2 className="fluid-h2 font-display-halyard font-medium tracking-tight uppercase text-[#ffedd7]">
                14 YEARS OF MONUMENTAL CELEBRATIONS
              </h2>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
              {planner.milestones.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeMilestoneIndex === idx
                      ? 'bg-[#382416] border-[#ffedd7] text-[#ffedd7]'
                      : 'bg-[#100904]/60 border-[#40372e] text-[#ffedd7]/60 hover:border-[#ffedd7]/40'
                  }`}
                >
                  <div className="text-xs sm:text-base font-bold text-[#dc5000]">{m.year}</div>
                  <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider truncate">{m.title}</div>
                  <div className="text-[7px] sm:text-[8px] text-[#ffedd7]/50 uppercase tracking-widest truncate">{m.location}</div>
                </button>
              ))}
            </div>

            {/* Active Milestone Card */}
            {planner.milestones[activeMilestoneIndex] && (
              <div className="p-3.5 sm:p-5 rounded-xl bg-[#382416]/60 border border-[#40372e] backdrop-blur-md space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#40372e] pb-2">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-[#dc5000] font-semibold uppercase tracking-widest mr-2">
                      {planner.milestones[activeMilestoneIndex].year} HIGHLIGHT
                    </span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide text-[#ffedd7]">
                      {planner.milestones[activeMilestoneIndex].title}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#ffedd7]/70 bg-[#100904] px-2 py-0.5 rounded-full border border-[#40372e]">
                    {planner.milestones[activeMilestoneIndex].location}
                  </span>
                </div>
                <p className="fluid-body text-[#ffedd7]/80 font-normal leading-relaxed">
                  {planner.milestones[activeMilestoneIndex].description}
                </p>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#dc5000]">
                  Role: {planner.milestones[activeMilestoneIndex].role}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => goToStage(8)}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>VIEW SIGNATURE SERVICES</span>
                <ArrowRight size={13} className="text-[#dc5000]" />
              </button>
            </div>
          </div>
        </div>

        {/* STAGE 8: BESPOKE SERVICES & OFFERINGS */}
        <div 
          className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex items-center justify-center transition-all duration-700 ${
            currentStage === 8 
              ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
          }`}
        >
          <div className="max-w-5xl mx-auto w-full space-y-3 sm:space-y-4 max-h-stage mobile-scroll-container py-2">
            <div className="space-y-1 sm:space-y-1.5">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#dc5000] font-semibold flex items-center gap-2">
                <Layers size={13} />
                <span>04 / BESPOKE CAPABILITIES</span>
              </div>
              <h2 className="fluid-h2 font-display-halyard font-medium tracking-tight uppercase text-[#ffedd7]">
                SIGNATURE PLANNING & DIRECTION PILLARS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-3.5 sm:p-5 rounded-xl bg-[#382416]/60 border border-[#40372e] backdrop-blur-md flex flex-col justify-between space-y-2.5 sm:space-y-3 hover:border-[#ffedd7]/50 transition-all"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-[36px] bg-[#100904] border border-[#40372e] text-[8px] sm:text-[9px] tracking-widest uppercase text-[#dc5000] font-semibold">
                      {srv.tierBadge}
                    </span>
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wider text-[#ffedd7] leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#ffedd7]/75 leading-relaxed font-normal">
                      {srv.description}
                    </p>

                    <div className="space-y-1 pt-1.5 border-t border-[#40372e]">
                      {srv.deliverables.slice(0, 3).map((d, i) => (
                        <div key={i} className="text-[9px] sm:text-[10px] text-[#ffedd7]/70 flex items-start gap-1">
                          <span className="text-[#dc5000] font-bold">•</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-[#40372e] flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] tracking-wider text-[#ffedd7]/60 uppercase">{srv.timeline}</span>
                    <button
                      onClick={() => goToStage(9)}
                      className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#dc5000] font-semibold hover:underline"
                    >
                      INQUIRE ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => goToStage(9)}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>RESERVE YOUR COMMISSION</span>
                <ArrowRight size={13} className="text-[#dc5000]" />
              </button>
            </div>
          </div>
        </div>

        {/* STAGE 9: PRIVATE COMMISSION INTAKE & DIRECT VIP CONCIERGE */}
        <div 
          className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex items-center justify-center transition-all duration-700 ${
            currentStage === 9 
              ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
          }`}
        >
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-center max-h-stage mobile-scroll-container py-2">
            
            {/* Left Column: Direct Atelier Contacts & Concierge */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#dc5000] font-semibold flex items-center gap-2">
                  <Sparkles size={13} />
                  <span>05 / PRIVATE COMMISSION INTAKE</span>
                </div>
                <h2 className="fluid-h2 font-display-halyard font-medium tracking-tight uppercase text-[#ffedd7]">
                  RESERVE A PRIVATE COMMISSION
                </h2>
              </div>

              <p className="fluid-body text-[#ffedd7]/80 leading-relaxed">
                Tare Precious accepts a considered number of commissions annually. Inquiries are handled with complete confidentiality.
              </p>

              <div className="space-y-2 pt-0.5">
                <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg bg-[#382416]/50 border border-[#40372e]">
                  <Phone size={14} className="text-[#dc5000] shrink-0" />
                  <div>
                    <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50">Direct Atelier Line</div>
                    <div className="text-[11px] sm:text-xs font-semibold text-[#ffedd7]">+234 9020 804 049</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg bg-[#382416]/50 border border-[#40372e]">
                  <Mail size={14} className="text-[#dc5000] shrink-0" />
                  <div>
                    <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50">Confidential Email</div>
                    <div className="text-[11px] sm:text-xs font-semibold text-[#ffedd7]">tareprecious5122@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-lg bg-[#382416]/50 border border-[#40372e]">
                  <Building size={14} className="text-[#dc5000] shrink-0" />
                  <div>
                    <div className="text-[8px] sm:text-[9px] tracking-wider uppercase text-[#ffedd7]/50">Atelier Locations</div>
                    <div className="text-[11px] sm:text-xs font-semibold text-[#ffedd7]">Victoria Island, Lagos · Mayfair, London</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row gap-2 pt-1">
                <Link
                  href="https://wa.me/2348038882026?text=Hello%20Zara%20Okonjo%20Atelier,%20I%20would%20like%20to%20reserve%20a%20private%20commission."
                  target="_blank"
                  className="flex-1 py-2 sm:py-2.5 rounded-[36px] bg-[#25D366]/20 border border-[#25D366]/50 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#25D366] hover:bg-[#25D366]/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={13} />
                  <span>WHATSAPP CONCIERGE</span>
                </Link>

                <button
                  onClick={() => goToStage(10)}
                  className="py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye size={12} className="text-[#dc5000]" />
                  <span>VIEW FULL TABLE</span>
                </button>
              </div>
            </div>

            {/* Right Column: Intake Submission Form */}
            <div className="lg:col-span-7">
              <form 
                onSubmit={handleInquirySubmit}
                className="p-4 sm:p-6 rounded-xl bg-[#382416]/70 border border-[#40372e] backdrop-blur-xl space-y-2.5 sm:space-y-3 shadow-2xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.clientName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, clientName: e.target.value })}
                      placeholder="e.g. Chief & Mrs. O. Balogun"
                      className="w-full bg-[#100904]/90 border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="e.g. contact@balogungroup.com"
                      className="w-full bg-[#100904]/90 border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="+234 803 000 0000"
                      className="w-full bg-[#100904]/90 border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Event Type</label>
                    <select
                      value={inquiryForm.eventType}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, eventType: e.target.value })}
                      className="w-full bg-[#100904] border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] rounded-none"
                    >
                      <option value="Imperial Nuptials (3-Day)">Imperial Nuptials (3-Day)</option>
                      <option value="Presidential / State Gala">Presidential / State Gala</option>
                      <option value="Banana Island Milestone Soirée">Banana Island Milestone Soirée</option>
                      <option value="Destination Celebration (Dubai/UK)">Destination Celebration (Dubai/UK)</option>
                      <option value="Spatial Scenography Only">Spatial Scenography Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Budget Scope</label>
                    <select
                      value={inquiryForm.budgetRange}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, budgetRange: e.target.value })}
                      className="w-full bg-[#100904] border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] rounded-none"
                    >
                      <option value="₦50M — ₦100M">₦50M — ₦100M</option>
                      <option value="₦100M — ₦250M">₦100M — ₦250M</option>
                      <option value="₦250M — ₦500M+">₦250M — ₦500M+</option>
                      <option value="$500,000 — $1.5M+">$500,000 — $1.5M+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Estimated Date</label>
                    <input
                      type="date"
                      value={inquiryForm.estimatedDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, estimatedDate: e.target.value })}
                      className="w-full bg-[#100904]/90 border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] sm:text-[9px] tracking-widest uppercase text-[#ffedd7]/60 mb-0.5">Your Vision & Spatial Notes</label>
                  <textarea
                    rows={2}
                    value={inquiryForm.visionNotes}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, visionNotes: e.target.value })}
                    placeholder="Describe your desired venue, theme, floral architecture or guest requirements..."
                    className="w-full bg-[#100904]/90 border-b border-[#ffedd7]/40 py-1 sm:py-1.5 px-1 text-xs text-[#ffedd7] focus:outline-none focus:border-[#dc5000] resize-none rounded-none"
                  />
                </div>

                {inquiryStatus === 'success' && (
                  <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-500/50 text-xs text-emerald-200">
                    ✓ Your inquiry has been received. Tare Precious&apos;s team will contact you within 12 hours.
                  </div>
                )}

                {inquiryStatus === 'error' && (
                  <div className="p-2.5 rounded-lg bg-red-900/40 border border-red-500/50 text-xs text-red-200">
                    ✕ An error occurred while submitting. Please message directly on WhatsApp.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={inquiryStatus === 'submitting'}
                  className="w-full py-2.5 sm:py-3 rounded-[36px] bg-[#382416] border border-[#ffedd7]/40 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#4a3220] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  {inquiryStatus === 'submitting' ? 'TRANSMITTING INQUIRY...' : 'SUBMIT PRIVATE COMMISSION REQUEST'}
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* STAGE 10: FULL UNOBSTRUCTED BANQUET TABLE SHOWCASE (NEW EXTRA STAGE) */}
        <div 
          className={`absolute inset-0 pt-14 sm:pt-20 pb-16 px-3 xs:px-4 sm:px-8 md:px-14 lg:px-20 flex flex-col justify-between transition-all duration-700 pointer-events-auto ${
            currentStage === 10 
              ? 'opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto' 
              : 'opacity-0 -translate-y-8 scale-95 pointer-events-none z-10'
          }`}
        >
          {/* Top Subtle Floating Badge */}
          <div className="pt-2 sm:pt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-[36px] bg-[#100904]/85 border border-[#ffedd7]/30 backdrop-blur-xl text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.24em] text-[#ffedd7] shadow-2xl">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#dc5000] animate-ping" />
              <span className="font-semibold text-center">THE ASSEMBLED SOVEREIGN BANQUET · FULL SCENOGRAPHY</span>
            </div>
          </div>

          {/* Center Space Unobstructed for the 3D Masterpiece */}
          <div className="flex-1 flex items-center justify-center pointer-events-none" />

          {/* Bottom Floating Action Bar */}
          <div className="pb-2 sm:pb-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => goToStage(0)}
              className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-[36px] bg-[#382416]/90 border border-[#ffedd7]/40 text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold text-[#ffedd7] hover:border-[#ffedd7] hover:bg-[#4a3220] transition-all flex items-center gap-2 shadow-2xl cursor-pointer backdrop-blur-md"
            >
              <RotateCcw size={13} className="text-[#dc5000]" />
              <span>GO BACK TO HOMEPAGE</span>
            </button>
          </div>
        </div>

      </main>

      {/* BOTTOM STICKY PROGRESS & STAGE BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 h-13 sm:h-16 px-3 xs:px-4 sm:px-10 flex items-center justify-between border-t border-[#40372e]/50 backdrop-blur-md bg-[#100904]/70">
        {/* Left Status Text */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={prevStage}
            disabled={currentStage === 0}
            className={`p-1.5 sm:p-2 rounded-full border border-[#ffedd7]/30 text-[#ffedd7] transition-all min-w-[32px] min-h-[32px] flex items-center justify-center ${
              currentStage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#ffedd7] hover:bg-[#382416]'
            }`}
            aria-label="Previous Stage"
          >
            <ArrowLeft size={13} />
          </button>

          <span className="text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-[#ffedd7]/70 font-serif truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
            {currentStage < 9 ? `0${currentStage + 1}` : currentStage + 1} / {totalStages} · {currentStageMeta.title}
          </span>
        </div>

        {/* Center Progress Bar Line */}
        <div className="flex-1 max-w-xs sm:max-w-sm mx-2 sm:mx-4 hidden md:block">
          <div className="relative w-full h-[2px] bg-[#40372e] rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-[#ffedd7] transition-all duration-500"
              style={{ width: `${((currentStage + 1) / totalStages) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <span className="text-[9px] tracking-widest uppercase text-[#dc5000] hidden lg:inline">
            SCROLL OR ARROWS
          </span>

          <button
            onClick={nextStage}
            disabled={currentStage === totalStages - 1}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-[36px] bg-[#382416] border border-[#ffedd7]/30 text-[10px] xs:text-[11px] sm:text-xs tracking-wider uppercase text-[#ffedd7] transition-all min-h-[32px] sm:min-h-[36px] ${
              currentStage === totalStages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#ffedd7]'
            }`}
          >
            <span className="truncate max-w-[110px] sm:max-w-none">{currentStage === totalStages - 2 ? 'REVEAL' : 'NEXT'}</span>
            <ArrowRight size={12} className="text-[#dc5000]" />
          </button>
        </div>
      </footer>

      {/* FULL DOSSIER & GALLERY MODAL */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default UnifiedStageFlow;
