'use client';

import React from 'react';
import { SectionConfig, SiteSettings } from '@/types/cms';
import { Compass, Box, Hammer, Music } from 'lucide-react';

interface ProcessSectionProps {
  config?: SectionConfig;
  settings: SiteSettings;
}

const PHASES = [
  {
    step: '01',
    title: 'Spatial Discovery & Feasibility Audit',
    icon: Compass,
    description:
      'We conduct on-site laser surveys and photometric audits—measuring natural sunset angles, historic architectural limits, and acoustic flows.',
    deliverable: 'Spatial Feasibility Dossier'
  },
  {
    step: '02',
    title: '3D WebGL Scenography & Light Simulation',
    icon: Box,
    description:
      'Every chandelier, floral canopy, mirrored banquet, and pinpoint beam is modeled in photorealistic 3D. You preview the space before fabrication starts.',
    deliverable: 'Real-Time 3D Interactive Walkthrough'
  },
  {
    step: '03',
    title: 'Couture Fabrication & Botanical Rigging',
    icon: Hammer,
    description:
      'Custom carpentry, cantilever glass pavilions, and thousands of heritage stems are curated by master artisans across Paris, Florence, and Kyoto.',
    deliverable: 'Custom Prototypes & Botanical Samples'
  },
  {
    step: '04',
    title: 'Symphonic Direction & Day-of Orchestration',
    icon: Music,
    description:
      'A dedicated 20-person production crew, discreet security detail, and acoustic masters execute the live timeline with effortless poise.',
    deliverable: 'Flawless Multi-Day VIP Experience'
  }
];

export default function ProcessSection({ config, settings }: ProcessSectionProps) {
  return (
    <section id="process" className="w-full bg-[#100904] text-[#ffedd7] py-24 md:py-36 px-6 sm:px-10 border-t border-[#40372e]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 dashed-divider pt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc5000]" />
              <span className="font-display-halyard text-xs text-[#ffedd7] uppercase tracking-wider">
                {config?.kicker || '06 / THE 4-PHASE PLANNING PROTOCOL'}
              </span>
            </div>
            <h2 className="font-display-halyard text-4xl sm:text-6xl text-[#ffedd7] uppercase leading-[0.9]">
              {config?.title || 'HOW WE WORK TOGETHER'}
            </h2>
          </div>

          <p className="font-body-conversational text-base sm:text-lg text-[#ffedd7]/80 max-w-md">
            {config?.subtitle ||
              'A disciplined architectural methodology turning monumental visions into effortless, timeless memories.'}
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHASES.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.step}
                className="bg-[#382416]/40 p-8 border border-[#40372e] rounded-[12px] flex flex-col justify-between hover:border-[#ffedd7] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-display-halyard text-2xl text-[#6c5f51]">
                      {phase.step}
                    </span>
                    <div className="w-9 h-9 rounded-[8px] bg-[#382416] border border-[#40372e] flex items-center justify-center text-[#ffedd7]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display-halyard text-lg text-[#ffedd7] uppercase leading-tight mb-3">
                    {phase.title}
                  </h3>

                  <p className="font-body-conversational text-xs text-[#ffedd7]/80 leading-relaxed mb-6">
                    {phase.description}
                  </p>
                </div>

                <div className="pt-4 dashed-divider">
                  <div className="font-display-halyard text-[10px] text-[#6c5f51] uppercase">Key Deliverable:</div>
                  <div className="font-display-halyard text-xs text-[#ffedd7] mt-0.5">
                    {phase.deliverable}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
