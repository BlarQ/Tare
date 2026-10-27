'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CmsDatabase,
  SiteSettings,
  NavigationItem,
  SectionConfig,
  EventProject,
  ServicePackage,
  Testimonial,
  VIPInquiry,
  CareerMilestone
} from '@/types/cms';
import {
  Shield,
  Layout,
  Compass,
  Sparkles,
  Calendar,
  Layers,
  Quote,
  Inbox,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Upload,
  Sliders,
  User,
  MapPin,
  Award,
  Database,
  Cloud,
  Key,
  Check,
  Copy
} from 'lucide-react';
import ImageUploader from '@/components/common/ImageUploader';

type Tab =
  | 'planner'
  | 'branding'
  | 'navigation'
  | 'sections'
  | 'events'
  | 'services'
  | 'testimonials'
  | 'inquiries'
  | 'supabase';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('planner');
  const [data, setData] = useState<CmsDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<{ isConfigured: boolean; connected: boolean; message: string } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  // Editing state for event / service / testimonial modals
  const [editingEvent, setEditingEvent] = useState<EventProject | null>(null);
  const [editingService, setEditingService] = useState<ServicePackage | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Fetch CMS data on load
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      const json = await res.json();
      setSupabaseStatus(json);
    } catch {
      setSupabaseStatus({ isConfigured: false, connected: false, message: 'Could not connect to Supabase API' });
    }
  };

  const handleSyncToSupabase = async () => {
    setSyncingSupabase(true);
    try {
      const res = await fetch('/api/supabase/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        checkSupabaseStatus();
      } else {
        showToast(json.message || 'Sync failed.');
      }
    } catch {
      showToast('Error syncing to Supabase.');
    } finally {
      setSyncingSupabase(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkSupabaseStatus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generic save all changes
  const handleSaveAll = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_all', payload: data })
      });
      const json = await res.json();
      if (json.success) {
        showToast('All CMS settings & content saved successfully!');
      }
    } catch (err) {
      console.error('Error saving data:', err);
      showToast('Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = async () => {
    if (!confirm('Are you sure you want to restore the initial luxury demo data?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_defaults' })
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        showToast('Restored default configuration and sample data.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">
            Loading Dynamic CMS Control Center...
          </span>
        </div>
      </div>
    );
  }

  const planner = data.settings.planner || {
    fullName: 'Aurelia Laurent',
    title: 'Principal Event Planner',
    tagline: 'Master Event Scenographer',
    portraitImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    curatorBio: '',
    philosophyStatement: '',
    signatureStyle: '',
    experienceYears: 5,
    eventsOrganized: 20,
    countriesWorked: 14,
    satisfactionRate: '100%',
    milestones: [],
    specialties: []
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-black border-b border-white/10 px-3 xs:px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="font-sans font-semibold text-xs sm:text-sm tracking-wider text-white uppercase truncate">
              {data.settings.brandName} — PORTFOLIO CMS STUDIO
            </h1>
            <span className="font-mono text-[9px] sm:text-[10px] text-neutral-400 block truncate">
              Personal Event Planner Profile, Works, Scenography &amp; CRM
            </span>
          </div>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Supabase Status Pill */}
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border font-mono text-[10px] sm:text-xs rounded-[2px] flex items-center gap-1.5 sm:gap-2 transition-colors ${
              supabaseStatus?.connected
                ? 'bg-[#3ecf8e]/10 border-[#3ecf8e]/40 text-[#3ecf8e] hover:bg-[#3ecf8e]/20'
                : supabaseStatus?.isConfigured
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title="Supabase Cloud Engine Status"
          >
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                supabaseStatus?.connected
                  ? 'bg-[#3ecf8e] animate-pulse'
                  : supabaseStatus?.isConfigured
                  ? 'bg-amber-400'
                  : 'bg-neutral-500'
              }`}
            />
            <span className="truncate">
              {supabaseStatus?.connected
                ? 'Supabase Cloud Active'
                : supabaseStatus?.isConfigured
                ? 'Supabase Configured'
                : 'Local JSON Store'}
            </span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-neutral-900 border border-white/15 text-neutral-300 hover:text-white font-mono text-[10px] sm:text-xs rounded-[2px] flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Live Website</span>
          </Link>

          <button
            onClick={handleResetDefaults}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-neutral-900 border border-white/15 text-neutral-400 hover:text-red-400 font-mono text-[10px] sm:text-xs rounded-[2px] flex items-center gap-1.5 transition-colors"
            title="Reset to default seed data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-3 sm:px-5 py-1 sm:py-2 bg-[#d4af37] text-black font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save All</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#d4af37] text-black font-mono text-xs px-5 py-3 rounded-[2px] shadow-2xl flex items-center gap-2 font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar / Mobile Horizontal Swipe Bar */}
        <aside className="w-full md:w-64 bg-black/70 border-b md:border-b-0 md:border-r border-white/10 p-2 sm:p-4 shrink-0 overflow-x-auto md:overflow-x-visible">
          <div className="flex flex-row md:flex-col gap-1 sm:gap-1.5 min-w-max md:min-w-0">
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'planner'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Planner Story
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'branding'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Brand &amp; Themes
            </button>

            <button
              onClick={() => setActiveTab('navigation')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'navigation'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Navigation
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'sections'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Layout &amp; Sections
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'events'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Works ({data.events.length})
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'services'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Services ({data.services.length})
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center gap-2.5 transition-colors text-left whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Press ({data.testimonials.length})
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center justify-between gap-3 transition-colors text-left whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Inquiries</span>
              </div>
              <span
                className={`px-1.5 py-0.5 text-[9px] rounded-full ${
                  activeTab === 'inquiries'
                    ? 'bg-black text-white'
                    : 'bg-[#ee3a49] text-white'
                }`}
              >
                {data.inquiries?.length || 0}
              </span>
            </button>

            {/* Supabase Tab */}
            <div className="pt-0 md:pt-3 md:mt-3 md:border-t border-white/10">
              <button
                onClick={() => setActiveTab('supabase')}
                className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs tracking-wider uppercase rounded-[2px] flex items-center justify-between gap-3 transition-colors text-left whitespace-nowrap ${
                  activeTab === 'supabase'
                    ? 'bg-[#3ecf8e] text-black font-bold'
                    : 'text-neutral-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3ecf8e]" />
                  <span>Supabase Cloud</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 p-3 xs:p-4 sm:p-6 md:p-10 overflow-y-auto max-w-6xl">
          {/* 1. PLANNER PROFILE & STORY TAB */}
          {activeTab === 'planner' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                  Event Planner Bio, Story &amp; Experience
                </h2>
                <p className="text-sm text-neutral-400 font-serif mt-1">
                  Manage the planner&apos;s personal portrait, philosophy statement, career statistics, and milestones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950 p-6 md:p-8 border border-white/10 rounded-[2px]">
                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Planner Full Name
                  </label>
                  <input
                    type="text"
                    value={planner.fullName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, fullName: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={planner.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, title: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    label="Planner Official Portrait Photo"
                    value={planner.portraitImage}
                    onChange={(url) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, portraitImage: url }
                        }
                      })
                    }
                    hint="Direct file upload · Auto-optimizes photos >5MB"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Personal Philosophy Statement (Headline Quote)
                  </label>
                  <textarea
                    rows={2}
                    value={planner.philosophyStatement}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, philosophyStatement: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Biography / Curator Story
                  </label>
                  <textarea
                    rows={4}
                    value={planner.curatorBio}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, curatorBio: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Years of Industry Experience
                  </label>
                  <input
                    type="number"
                    value={planner.experienceYears}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, experienceYears: parseInt(e.target.value) || 0 }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Events Delivered
                  </label>
                  <input
                    type="number"
                    value={planner.eventsOrganized}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, eventsOrganized: parseInt(e.target.value) || 0 }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Countries / Destinations Worked
                  </label>
                  <input
                    type="number"
                    value={planner.countriesWorked}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, countriesWorked: parseInt(e.target.value) || 0 }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Signature Style / Aesthetic
                  </label>
                  <input
                    type="text"
                    value={planner.signatureStyle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          planner: { ...planner, signatureStyle: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. BRANDING & THEME TAB */}
          {activeTab === 'branding' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                  Brand Identity &amp; Visual Design Engine
                </h2>
                <p className="text-sm text-neutral-400 font-serif mt-1">
                  Configure brand naming, typography, luxury color presets, and social presence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950 p-6 md:p-8 border border-white/10 rounded-[2px]">
                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Brand / Atelier Name
                  </label>
                  <input
                    type="text"
                    value={data.settings.brandName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, brandName: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Monogram Mark (2 Letters)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={data.settings.monogram}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, monogram: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Tagline / Sub-Title
                  </label>
                  <input
                    type="text"
                    value={data.settings.tagline}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, tagline: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Global Locations / Coordinates
                  </label>
                  <input
                    type="text"
                    value={data.settings.location}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, location: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Primary Accent Color (Hex)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={data.settings.accentColor}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, accentColor: e.target.value }
                        })
                      }
                      className="w-10 h-10 rounded-[2px] bg-black border border-white/20 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={data.settings.accentColor}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: { ...data.settings, accentColor: e.target.value }
                        })
                      }
                      className="flex-1 bg-black border border-white/15 px-4 py-2.5 text-sm text-white font-mono focus:border-[#d4af37] rounded-[2px]"
                    />
                  </div>
                </div>

                {/* Direct Brand Logo Uploaders */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <ImageUploader
                    label="Light Theme Monogram / Logo Mark"
                    value={data.settings.logoLight || ''}
                    onChange={(url) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, logoLight: url }
                      })
                    }
                    hint="PNG / SVG / WebP with transparent background"
                  />
                  <ImageUploader
                    label="Dark Theme Monogram / Logo Mark"
                    value={data.settings.logoDark || ''}
                    onChange={(url) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, logoDark: url }
                      })
                    }
                    hint="PNG / SVG / WebP with transparent background"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={data.settings.contactEmail}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, contactEmail: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Private Concierge Phone
                  </label>
                  <input
                    type="text"
                    value={data.settings.contactPhone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, contactPhone: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2">
                    Bottom Persistent Bar Status Text
                  </label>
                  <input
                    type="text"
                    value={data.settings.bottomBarStatusText}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, bottomBarStatusText: e.target.value }
                      })
                    }
                    className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#d4af37] rounded-[2px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. NAVIGATION BUILDER TAB */}
          {activeTab === 'navigation' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                    Navigation &amp; Link Builder
                  </h2>
                  <p className="text-sm text-neutral-400 font-serif mt-1">
                    Add, edit, reorder, and configure header and bottom actions.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newItem: NavigationItem = {
                      id: `nav-${Date.now()}`,
                      label: 'NEW LINK',
                      url: '#',
                      order: data.navigation.length + 1,
                      isVisible: true
                    };
                    setData({
                      ...data,
                      navigation: [...data.navigation, newItem]
                    });
                  }}
                  className="px-4 py-2 bg-white text-black font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-[#d4af37] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {data.navigation
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 bg-neutral-950 border border-white/10 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="font-mono text-xs text-neutral-500 w-6">
                          0{index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = data.navigation.map((nav) =>
                              nav.id === item.id ? { ...nav, label: e.target.value } : nav
                            );
                            setData({ ...data, navigation: updated });
                          }}
                          className="bg-black border border-white/15 px-3 py-1.5 text-xs text-white font-mono rounded-[2px] uppercase w-40"
                        />
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => {
                            const updated = data.navigation.map((nav) =>
                              nav.id === item.id ? { ...nav, url: e.target.value } : nav
                            );
                            setData({ ...data, navigation: updated });
                          }}
                          className="bg-black border border-white/15 px-3 py-1.5 text-xs text-neutral-300 font-mono rounded-[2px] flex-1 md:w-64"
                        />
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <label className="flex items-center gap-2 font-mono text-xs text-neutral-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isCta || false}
                            onChange={(e) => {
                              const updated = data.navigation.map((nav) =>
                                nav.id === item.id ? { ...nav, isCta: e.target.checked } : nav
                              );
                              setData({ ...data, navigation: updated });
                            }}
                            className="rounded accent-[#d4af37]"
                          />
                          <span>Primary CTA Button</span>
                        </label>

                        <label className="flex items-center gap-2 font-mono text-xs text-neutral-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isVisible}
                            onChange={(e) => {
                              const updated = data.navigation.map((nav) =>
                                nav.id === item.id ? { ...nav, isVisible: e.target.checked } : nav
                              );
                              setData({ ...data, navigation: updated });
                            }}
                            className="rounded accent-[#d4af37]"
                          />
                          <span>Visible</span>
                        </label>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => {
                              const navs = [...data.navigation];
                              const temp = navs[index].order;
                              navs[index].order = navs[index - 1].order;
                              navs[index - 1].order = temp;
                              setData({ ...data, navigation: navs });
                            }}
                            className="p-1.5 bg-neutral-900 border border-white/10 rounded-[2px] hover:bg-neutral-800 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={index === data.navigation.length - 1}
                            onClick={() => {
                              const navs = [...data.navigation];
                              const temp = navs[index].order;
                              navs[index].order = navs[index + 1].order;
                              navs[index + 1].order = temp;
                              setData({ ...data, navigation: navs });
                            }}
                            className="p-1.5 bg-neutral-900 border border-white/10 rounded-[2px] hover:bg-neutral-800 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setData({
                              ...data,
                              navigation: data.navigation.filter((n) => n.id !== item.id)
                            });
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 4. LAYOUT & SECTIONS TAB */}
          {activeTab === 'sections' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                  Homepage Section Arranger &amp; Toggle
                </h2>
                <p className="text-sm text-neutral-400 font-serif mt-1">
                  Rearrange the structural storytelling order and toggle individual modules on or off.
                </p>
              </div>

              <div className="space-y-4">
                {data.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <div
                      key={section.key}
                      className="p-6 bg-neutral-950 border border-white/10 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#d4af37]">
                            Position 0{index + 1}
                          </span>
                          <span className="font-mono text-xs text-neutral-500 uppercase">
                            [{section.key}]
                          </span>
                        </div>
                        <h3 className="font-sans text-lg font-normal text-white uppercase tracking-tight">
                          {section.label}
                        </h3>
                        <p className="font-serif text-xs text-neutral-400 max-w-xl">
                          Title: &ldquo;{section.title}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 font-mono text-xs text-neutral-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={section.isEnabled}
                            onChange={(e) => {
                              const updated = data.sections.map((s) =>
                                s.key === section.key ? { ...s, isEnabled: e.target.checked } : s
                              );
                              setData({ ...data, sections: updated });
                            }}
                            className="rounded accent-[#d4af37]"
                          />
                          <span>Enabled on Frontend</span>
                        </label>

                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => {
                              const sects = [...data.sections];
                              const temp = sects[index].order;
                              sects[index].order = sects[index - 1].order;
                              sects[index - 1].order = temp;
                              setData({ ...data, sections: sects });
                            }}
                            className="p-2 bg-neutral-900 border border-white/10 rounded-[2px] hover:bg-neutral-800 disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            disabled={index === data.sections.length - 1}
                            onClick={() => {
                              const sects = [...data.sections];
                              const temp = sects[index].order;
                              sects[index].order = sects[index + 1].order;
                              sects[index + 1].order = temp;
                              setData({ ...data, sections: sects });
                            }}
                            className="p-2 bg-neutral-900 border border-white/10 rounded-[2px] hover:bg-neutral-800 disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 5. EVENT PORTFOLIO TAB */}
          {activeTab === 'events' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                    Event Portfolio &amp; Case Studies
                  </h2>
                  <p className="text-sm text-neutral-400 font-serif mt-1">
                    Manage weddings, galas, photo galleries, video reels, and client quotes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newEvent: EventProject = {
                      id: `event-${Date.now()}`,
                      slug: `new-event-${Date.now()}`,
                      title: 'NEW CELEBRATION MASTERPIECE',
                      subtitle: 'Bespoke Location',
                      category: 'Luxury Wedding',
                      year: '2026',
                      location: 'Paris, France',
                      venue: 'Historic Estate',
                      guestCount: '200 Guests',
                      budgetTier: '€1.5M+',
                      coverImage:
                        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
                      galleryImages: [
                        'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop'
                      ],
                      description: 'Comprehensive architectural event description.',
                      deliverables: ['Custom Glass Pavilions', 'Full Botanical Rigging'],
                      isFeatured: true,
                      order: data.events.length + 1
                    };
                    setEditingEvent(newEvent);
                  }}
                  className="px-4 py-2 bg-[#d4af37] text-black font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Event Masterpiece
                </button>
              </div>

              {/* Events List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-neutral-950 border border-white/10 rounded-[2px] overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full bg-neutral-900">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 text-[10px] font-mono uppercase text-[#d4af37] rounded-[2px]">
                        {event.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 text-[10px] font-mono text-white rounded-[2px]">
                        {event.year} · {event.location}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-sans text-lg font-normal text-white uppercase tracking-tight">
                        {event.title}
                      </h3>
                      <p className="font-mono text-xs text-[#d4af37] uppercase">
                        {event.venue}
                      </p>
                      <p className="font-serif text-xs text-neutral-400 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono text-xs text-neutral-400">
                          {event.budgetTier}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="p-2 bg-neutral-900 hover:bg-white/10 text-white rounded-[2px] transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete "${event.title}"?`)) {
                                setData({
                                  ...data,
                                  events: data.events.filter((e) => e.id !== event.id)
                                });
                              }
                            }}
                            className="p-2 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded-[2px] transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Edit Modal */}
              {editingEvent && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="bg-[#0e0e0e] border border-white/20 p-8 rounded-[2px] w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="font-sans text-xl text-white uppercase">
                        Edit Event Case Study
                      </h3>
                      <button
                        onClick={() => setEditingEvent(null)}
                        className="text-neutral-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Event Title
                        </label>
                        <input
                          type="text"
                          value={editingEvent.title}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, title: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={editingEvent.category}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, category: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          value={editingEvent.venue}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, venue: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Location (City, Country)
                        </label>
                        <input
                          type="text"
                          value={editingEvent.location}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, location: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Guest Count
                        </label>
                        <input
                          type="text"
                          value={editingEvent.guestCount}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, guestCount: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Production Budget Scope
                        </label>
                        <input
                          type="text"
                          value={editingEvent.budgetTier}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, budgetTier: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <ImageUploader
                          label="Event Case Study Cover Image"
                          value={editingEvent.coverImage}
                          onChange={(url) =>
                            setEditingEvent({ ...editingEvent, coverImage: url })
                          }
                          hint="Main card & 3D backdrop photo · Auto-compresses >5MB"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <ImageUploader
                          label="Perspective Scenography Gallery (Upload Multiple Photos)"
                          multiple={true}
                          values={editingEvent.galleryImages || []}
                          onMultipleChange={(urls) =>
                            setEditingEvent({ ...editingEvent, galleryImages: urls })
                          }
                          hint="Add unlimited high-res architectural photos"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                          Narrative Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingEvent.description}
                          onChange={(e) =>
                            setEditingEvent({ ...editingEvent, description: e.target.value })
                          }
                          className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setEditingEvent(null)}
                        className="px-4 py-2 bg-neutral-900 text-xs font-mono text-neutral-300 rounded-[2px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const exists = data.events.some((e) => e.id === editingEvent.id);
                          const updated = exists
                            ? data.events.map((e) =>
                                e.id === editingEvent.id ? editingEvent : e
                              )
                            : [...data.events, editingEvent];
                          setData({ ...data, events: updated });
                          setEditingEvent(null);
                          showToast('Event updated in staging.');
                        }}
                        className="px-5 py-2 bg-[#d4af37] text-black font-mono text-xs font-bold rounded-[2px]"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                    Packages &amp; Planning Services
                  </h2>
                  <p className="text-sm text-neutral-400 font-serif mt-1">
                    Manage packages, deliverables, timelines, and investment tiers.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newSrv: ServicePackage = {
                      id: `srv-${Date.now()}`,
                      title: 'NEW PLANNING PACKAGE',
                      tagline: 'Comprehensive Event Direction Scope',
                      tierBadge: 'BESPOKE SCOPE',
                      description: 'Comprehensive description of the planning scope.',
                      deliverables: ['Custom 3D Pre-vis', 'Full Floral Architecture'],
                      timeline: '6 — 12 Months',
                      investmentTier: 'Starting from €50,000',
                      isFeatured: false,
                      order: data.services.length + 1
                    };
                    setEditingService(newSrv);
                  }}
                  className="px-4 py-2 bg-[#d4af37] text-black font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Service Package
                </button>
              </div>

              <div className="space-y-4">
                {data.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 bg-neutral-950 border border-white/10 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#d4af37]">
                          {service.tierBadge}
                        </span>
                        <span className="font-mono text-xs text-neutral-500">
                          {service.timeline}
                        </span>
                      </div>
                      <h3 className="font-sans text-xl font-normal text-white uppercase tracking-tight">
                        {service.title}
                      </h3>
                      <p className="font-serif text-sm text-neutral-400 max-w-xl">
                        {service.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-neutral-300">
                        {service.investmentTier}
                      </span>

                      <button
                        onClick={() => setEditingService(service)}
                        className="p-2 bg-neutral-900 hover:bg-white/10 text-white rounded-[2px]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${service.title}"?`)) {
                            setData({
                              ...data,
                              services: data.services.filter((s) => s.id !== service.id)
                            });
                          }
                        }}
                        className="p-2 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded-[2px]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Edit Modal */}
              {editingService && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="bg-[#0e0e0e] border border-white/20 p-8 rounded-[2px] w-full max-w-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="font-sans text-xl text-white uppercase">
                        Edit Planning Package
                      </h3>
                      <button
                        onClick={() => setEditingService(null)}
                        className="text-neutral-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Package Title
                      </label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={editingService.tagline}
                        onChange={(e) =>
                          setEditingService({ ...editingService, tagline: e.target.value })
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={editingService.tierBadge}
                        onChange={(e) =>
                          setEditingService({ ...editingService, tierBadge: e.target.value })
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Investment / Fee Description
                      </label>
                      <input
                        type="text"
                        value={editingService.investmentTier}
                        onChange={(e) =>
                          setEditingService({ ...editingService, investmentTier: e.target.value })
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 bg-neutral-900 text-xs font-mono text-neutral-300 rounded-[2px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const exists = data.services.some((s) => s.id === editingService.id);
                          const updated = exists
                            ? data.services.map((s) =>
                                s.id === editingService.id ? editingService : s
                              )
                            : [...data.services, editingService];
                          setData({ ...data, services: updated });
                          setEditingService(null);
                          showToast('Service updated.');
                        }}
                        className="px-5 py-2 bg-[#d4af37] text-black font-mono text-xs font-bold rounded-[2px]"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. TESTIMONIALS & PRESS TAB */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                    Client Reviews &amp; Press Quotes
                  </h2>
                  <p className="text-sm text-neutral-400 font-serif mt-1">
                    Manage client reviews and international luxury press features.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newTest: Testimonial = {
                      id: `t-${Date.now()}`,
                      quote: 'An unparalleled mastery of spatial lighting and romantic elegance.',
                      clientName: 'VIP Couple',
                      eventTitle: 'Private Nuptials',
                      location: 'Lake Como',
                      date: '2026',
                      pressOutlet: 'Vogue Weddings',
                      isFeatured: true,
                      order: data.testimonials.length + 1
                    };
                    setEditingTestimonial(newTest);
                  }}
                  className="px-4 py-2 bg-[#d4af37] text-black font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Review / Press
                </button>
              </div>

              <div className="space-y-4">
                {data.testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 bg-neutral-950 border border-white/10 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <p className="font-serif text-base text-neutral-200 italic max-w-2xl">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="font-mono text-xs text-[#d4af37]">
                        {t.clientName} — {t.eventTitle} ({t.location})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-400 border border-white/10 px-2.5 py-1 rounded-[2px]">
                        {t.pressOutlet || 'Direct Client'}
                      </span>

                      <button
                        onClick={() => setEditingTestimonial(t)}
                        className="p-2 bg-neutral-900 hover:bg-white/10 text-white rounded-[2px]"
                        title="Edit Review"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Delete this testimonial?')) {
                            setData({
                              ...data,
                              testimonials: data.testimonials.filter((item) => item.id !== t.id)
                            });
                          }
                        }}
                        className="p-2 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded-[2px]"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial Edit Modal */}
              {editingTestimonial && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
                  <div className="bg-[#0e0e0e] border border-white/20 p-8 rounded-[2px] w-full max-w-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="font-sans text-xl text-white uppercase">
                        Edit Client Review / Press Quote
                      </h3>
                      <button
                        onClick={() => setEditingTestimonial(null)}
                        className="text-neutral-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Client / Source Name
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.clientName}
                        onChange={(e) =>
                          setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Press Outlet / Affiliation
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.pressOutlet || ''}
                        onChange={(e) =>
                          setEditingTestimonial({ ...editingTestimonial, pressOutlet: e.target.value })
                        }
                        placeholder="e.g. Vogue Weddings / Architectural Digest"
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-neutral-400 uppercase mb-1">
                        Quote Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={editingTestimonial.quote}
                        onChange={(e) =>
                          setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                        }
                        className="w-full bg-black border border-white/15 px-3 py-2 text-xs text-white rounded-[2px]"
                      />
                    </div>

                    <ImageUploader
                      label="Client Avatar or Press Publication Logo"
                      value={editingTestimonial.avatar || ''}
                      onChange={(url) =>
                        setEditingTestimonial({ ...editingTestimonial, avatar: url })
                      }
                      hint="Direct photo upload"
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setEditingTestimonial(null)}
                        className="px-4 py-2 bg-neutral-900 text-xs font-mono text-neutral-300 rounded-[2px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const exists = data.testimonials.some((item) => item.id === editingTestimonial.id);
                          const updated = exists
                            ? data.testimonials.map((item) =>
                                item.id === editingTestimonial.id ? editingTestimonial : item
                              )
                            : [...data.testimonials, editingTestimonial];
                          setData({ ...data, testimonials: updated });
                          setEditingTestimonial(null);
                          showToast('Review updated in staging.');
                        }}
                        className="px-5 py-2 bg-[#d4af37] text-black font-mono text-xs font-bold rounded-[2px]"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. VIP INQUIRIES & LEAD CRM TAB */}
          {activeTab === 'inquiries' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                  VIP Inquiries &amp; Commission Leads
                </h2>
                <p className="text-sm text-neutral-400 font-serif mt-1">
                  Review and manage incoming high-value client commission requests.
                </p>
              </div>

              {data.inquiries && data.inquiries.length > 0 ? (
                <div className="space-y-4">
                  {data.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 bg-neutral-950 border border-white/15 rounded-[2px] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <span className="font-mono text-xs text-[#d4af37] uppercase">
                            {inq.eventType}
                          </span>
                          <h3 className="font-sans text-xl font-normal text-white mt-1">
                            {inq.clientName}
                          </h3>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-neutral-400">Status:</span>
                          <select
                            value={inq.status}
                            onChange={(e) => {
                              const updated = data.inquiries.map((i) =>
                                i.id === inq.id
                                  ? { ...i, status: e.target.value as VIPInquiry['status'] }
                                  : i
                              );
                              setData({ ...data, inquiries: updated });
                              showToast(`Lead status updated to ${e.target.value}`);
                            }}
                            className="bg-black border border-white/20 text-xs font-mono text-white px-3 py-1.5 rounded-[2px]"
                          >
                            <option value="new">🟢 New Commission</option>
                            <option value="reviewing">🟡 Under Review</option>
                            <option value="proposal_sent">🔵 Proposal Transmitted</option>
                            <option value="booked">⭐ Booked / Commissioned</option>
                            <option value="archived">⚪ Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                        <div>
                          <div className="text-neutral-500 uppercase text-[10px]">Email</div>
                          <div className="text-white mt-0.5">{inq.email}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 uppercase text-[10px]">Phone</div>
                          <div className="text-white mt-0.5">{inq.phone || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 uppercase text-[10px]">Date / Location</div>
                          <div className="text-white mt-0.5">{inq.estimatedDate} · {inq.location}</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 uppercase text-[10px]">Budget Tier</div>
                          <div className="text-[#d4af37] font-semibold mt-0.5">{inq.budgetRange}</div>
                        </div>
                      </div>

                      {/* Vision Note */}
                      {inq.visionNotes && (
                        <div className="p-4 bg-black/60 border border-white/10 rounded-[2px]">
                          <div className="font-mono text-[10px] text-neutral-400 uppercase mb-1">
                            Client Vision &amp; Spatial Aspirations:
                          </div>
                          <p className="font-serif text-sm text-neutral-300 leading-relaxed">
                            {inq.visionNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-neutral-950 border border-white/10 rounded-[2px]">
                  <Inbox className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                  <h3 className="font-sans text-lg text-white">No inquiries received yet</h3>
                  <p className="font-serif text-sm text-neutral-400 mt-1">
                    Commission requests submitted through the frontend booking form will appear here in real time.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 9. SUPABASE CLOUD BACKEND TAB */}
          {activeTab === 'supabase' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-5 h-5 text-[#3ecf8e]" />
                  <h2 className="font-sans text-2xl font-light text-white uppercase tracking-tight">
                    Supabase Cloud PostgreSQL &amp; Storage Engine
                  </h2>
                </div>
                <p className="text-sm text-neutral-400 font-serif">
                  Manage cloud synchronization, relational database tables, RLS security policies, and high-resolution media storage.
                </p>
              </div>

              {/* Live Connection Card */}
              <div className="bg-neutral-950 border border-white/15 p-6 md:p-8 rounded-[2px] space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-[2px] flex items-center justify-center font-bold text-lg ${
                        supabaseStatus?.connected
                          ? 'bg-[#3ecf8e]/20 text-[#3ecf8e] border border-[#3ecf8e]/40'
                          : supabaseStatus?.isConfigured
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-neutral-900 text-neutral-400 border border-white/10'
                      }`}
                    >
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-sans text-lg font-normal text-white">
                          Cloud Backend Status
                        </h3>
                        <span
                          className={`font-mono text-[10px] px-2.5 py-0.5 rounded-[2px] uppercase font-bold ${
                            supabaseStatus?.connected
                              ? 'bg-[#3ecf8e]/20 text-[#3ecf8e] border border-[#3ecf8e]/40'
                              : supabaseStatus?.isConfigured
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-neutral-900 text-neutral-400 border border-white/10'
                          }`}
                        >
                          {supabaseStatus?.connected
                            ? 'Cloud Connected'
                            : supabaseStatus?.isConfigured
                            ? 'Configured / Pending Schema'
                            : 'Local Fallback Mode'}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-neutral-400 mt-1">
                        {supabaseStatus?.message || 'Checking connection...'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={checkSupabaseStatus}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 font-mono text-xs text-white rounded-[2px] flex items-center gap-2 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </button>

                    <button
                      onClick={handleSyncToSupabase}
                      disabled={syncingSupabase || !supabaseStatus?.connected}
                      className="px-5 py-2 bg-[#3ecf8e] hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-2 transition-colors shadow-lg shadow-[#3ecf8e]/20 disabled:opacity-40"
                    >
                      {syncingSupabase ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Push CMS Data to Supabase</span>
                    </button>
                  </div>
                </div>

                {/* Technical Architecture Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-black/60 border border-white/10 rounded-[2px]">
                    <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                      Database Tables
                    </div>
                    <div className="text-xl font-sans font-light text-white mt-1">
                      8 Relational Tables
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500 mt-2">
                      site_settings, planner_profile, event_projects, service_packages, testimonials, vip_inquiries, navigation_items, sections_config
                    </div>
                  </div>

                  <div className="p-4 bg-black/60 border border-white/10 rounded-[2px]">
                    <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                      Storage Bucket
                    </div>
                    <div className="text-xl font-sans font-light text-[#3ecf8e] mt-1">
                      cms-assets
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500 mt-2">
                      Public bucket for client photography, editorial hero covers, and gallery assets.
                    </div>
                  </div>

                  <div className="p-4 bg-black/60 border border-white/10 rounded-[2px]">
                    <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                      Real-time Dynamic Sync
                    </div>
                    <div className="text-xl font-sans font-light text-[#d4af37] mt-1">
                      Active
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500 mt-2">
                      When original information is saved, dummy data is automatically superseded across the frontend.
                    </div>
                  </div>
                </div>
              </div>

              {/* Setup & Environment Guide */}
              <div className="bg-neutral-950 border border-white/15 p-6 md:p-8 rounded-[2px] space-y-6">
                <div>
                  <h3 className="font-sans text-xl font-light text-white uppercase tracking-tight">
                    Supabase Configuration &amp; Credentials
                  </h3>
                  <p className="font-serif text-sm text-neutral-400 mt-1">
                    To link your Supabase project, provide your credentials in <code className="text-[#d4af37] font-mono">.env.local</code>:
                  </p>
                </div>

                <div className="p-4 bg-black border border-white/10 rounded-[2px] font-mono text-xs text-neutral-300 space-y-2 overflow-x-auto">
                  <div className="text-neutral-500"># .env.local</div>
                  <div><span className="text-[#3ecf8e]">NEXT_PUBLIC_SUPABASE_URL</span>=https://your-project.supabase.co</div>
                  <div><span className="text-[#3ecf8e]">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
                  <div><span className="text-[#3ecf8e]">SUPABASE_SERVICE_ROLE_KEY</span>=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... <span className="text-neutral-500">(Optional for admin bypass)</span></div>
                </div>

                <div className="p-4 bg-black/40 border border-white/10 rounded-[2px] space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider">
                    <Key className="w-4 h-4 text-[#d4af37]" />
                    <span>Database Schema Migration File</span>
                  </div>
                  <p className="font-serif text-sm text-neutral-300 leading-relaxed">
                    The complete PostgreSQL schema script is pre-generated at <code className="text-[#3ecf8e] font-mono">supabase/schema.sql</code> and sample seed at <code className="text-[#3ecf8e] font-mono">supabase/seed.sql</code>. You can copy and run it directly in your Supabase SQL Editor to initialize all tables, foreign keys, indexes, and Row Level Security policies with a single click.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
