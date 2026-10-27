'use client';

import React, { useState } from 'react';
import { SectionConfig, SiteSettings } from '@/types/cms';
import { Send, CheckCircle, Shield, AlertCircle } from 'lucide-react';

interface VIPInquirySectionProps {
  config?: SectionConfig;
  settings: SiteSettings;
}

export default function VIPInquirySection({ config, settings }: VIPInquirySectionProps) {
  const { planner } = settings;
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    eventType: 'Luxury Wedding (Multi-Day)',
    estimatedDate: '',
    location: '',
    guestCount: '100 — 250 Guests',
    budgetRange: '€1.0M — €2.5M',
    visionNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setError(json.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please contact the concierge directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="w-full bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
                <span className="font-display-halyard text-xs text-[#ffedd7] uppercase tracking-wider">
                  {config?.kicker || '08 / PRIVATE COMMISSION & CONSULTATION'}
                </span>
              </div>
              <h2 className="font-display-halyard text-4xl sm:text-6xl text-[#ffedd7] uppercase leading-[0.9] mb-6">
                {config?.title || 'BOOK A CONSULTATION'}
              </h2>

              <p className="font-body-conversational text-lg text-[#ffedd7]/85 leading-relaxed mb-8">
                {config?.subtitle ||
                  `To safeguard absolute intimacy and unmatched artistic execution, ${planner.fullName} accepts only 12 master commissions globally each year.`}
              </p>

              {/* Direct Concierge Contact */}
              <div className="space-y-4 pt-6 dashed-divider">
                <div>
                  <div className="font-display-halyard text-[10px] text-[#6c5f51] uppercase">
                    Direct Private Line
                  </div>
                  <div className="font-mono text-sm text-[#ffedd7] mt-0.5">{settings.contactPhone}</div>
                </div>
                <div>
                  <div className="font-display-halyard text-[10px] text-[#6c5f51] uppercase">
                    Concierge Communications
                  </div>
                  <div className="font-mono text-sm text-[#dc5000] mt-0.5">{settings.contactEmail}</div>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee Card (12px radius from DESIGN-3.md) */}
            <div className="p-5 bg-[#382416]/40 border border-[#40372e] rounded-[12px] flex items-start gap-3">
              <Shield className="w-4 h-4 text-[#dc5000] shrink-0 mt-0.5" />
              <div className="text-xs text-[#ffedd7]/80 leading-relaxed font-body-conversational">
                <strong>Strict Confidentiality:</strong> All consultations and guest metrics are protected under strict non-disclosure protocols.
              </div>
            </div>
          </div>

          {/* Right Column: Underline-Only Form from DESIGN-3.md */}
          <div className="lg:col-span-7 bg-[#100904] p-8 sm:p-10 border border-[#40372e] rounded-[12px]">
            {submitted ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-14 h-14 bg-[#382416] border border-[#ffedd7] text-[#ffedd7] rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-[#dc5000]" />
                </div>
                <h3 className="font-display-halyard text-2xl sm:text-3xl text-[#ffedd7] uppercase">
                  Consultation Request Received
                </h3>
                <p className="font-body-conversational text-[#ffedd7]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#ffedd7]">{formData.clientName}</strong>. {planner.fullName} and our concierge team will review your dates and reach out within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost-cream text-xs"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 bg-[#382416] border border-[#dc5000] text-[#ffedd7] text-xs flex items-center gap-2 rounded-[8px]">
                    <AlertCircle className="w-4 h-4 text-[#dc5000] shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name & Email (Underline-Only Inputs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Victoria Sterling"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full input-underline-cream text-sm placeholder:text-[#6c5f51]"
                    />
                  </div>

                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Direct Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. victoria@sterling.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full input-underline-cream text-sm placeholder:text-[#6c5f51]"
                    />
                  </div>
                </div>

                {/* Phone & Event Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Telephone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 20 7946 0992"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full input-underline-cream text-sm placeholder:text-[#6c5f51]"
                    />
                  </div>

                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Event Category *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full input-underline-cream text-sm bg-[#100904]"
                    >
                      <option value="Luxury Wedding (Multi-Day)">Luxury Wedding (Multi-Day)</option>
                      <option value="High-Jewelry Gala & Ball">High-Jewelry Gala &amp; Ball</option>
                      <option value="Private Island / Estate Soirée">Private Island / Estate Soirée</option>
                      <option value="Haute Couture Runway Scenography">Haute Couture Runway Scenography</option>
                      <option value="Milestone Anniversary">Milestone Anniversary</option>
                    </select>
                  </div>
                </div>

                {/* Date & Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Estimated Date / Season
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Summer 2026 or Sept 18, 2026"
                      value={formData.estimatedDate}
                      onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                      className="w-full input-underline-cream text-sm placeholder:text-[#6c5f51]"
                    />
                  </div>

                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Desired Destination
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lake Como, Paris, Kyoto, NYC"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full input-underline-cream text-sm placeholder:text-[#6c5f51]"
                    />
                  </div>
                </div>

                {/* Guests & Budget Tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Guest Capacity
                    </label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      className="w-full input-underline-cream text-sm bg-[#100904]"
                    >
                      <option value="Under 50 (Intimate Haute VIP)">Under 50 (Intimate Haute VIP)</option>
                      <option value="50 — 150 Guests">50 — 150 Guests</option>
                      <option value="150 — 300 Guests">150 — 300 Guests</option>
                      <option value="300 — 600+ Guests">300 — 600+ Guests</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                      Production Scope
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full input-underline-cream text-sm bg-[#100904]"
                    >
                      <option value="€500,000 — €1,000,000">€500,000 — €1,000,000</option>
                      <option value="€1,000,000 — €2,500,000">€1,000,000 — €2,500,000</option>
                      <option value="€2,500,000 — €5,000,000+">€2,500,000 — €5,000,000+</option>
                      <option value="Custom Bespoke Allocation">Custom Bespoke Allocation</option>
                    </select>
                  </div>
                </div>

                {/* Vision / Notes */}
                <div>
                  <label className="block font-display-halyard text-[11px] text-[#6c5f51] uppercase mb-1">
                    Celebration Vision &amp; Spatial Aspirations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your aesthetic inspirations, dream venue, acoustic or botanical dreams..."
                    value={formData.visionNotes}
                    onChange={(e) => setFormData({ ...formData, visionNotes: e.target.value })}
                    className="w-full input-underline-cream text-sm placeholder:text-[#6c5f51] resize-none"
                  />
                </div>

                {/* Submit Button: Pill Button from DESIGN-3.md */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-pill-bark flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-[#ffedd7] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Private Consultation Request</span>
                      <Send className="w-3.5 h-3.5 text-[#dc5000]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
