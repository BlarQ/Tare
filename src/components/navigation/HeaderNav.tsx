'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings, NavigationItem } from '@/types/cms';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';

interface HeaderNavProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
}

export default function HeaderNav({ settings, navigation }: HeaderNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleNav = navigation.filter((item) => item.isVisible).sort((a, b) => a.order - b.order);
  const ctaItem = visibleNav.find((item) => item.isCta);
  const regularNav = visibleNav.filter((item) => !item.isCta);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 sm:px-10 py-5 ${
        scrolled
          ? 'bg-[#100904]/90 backdrop-blur-md border-b border-[#40372e]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Wordmark in Warm Cream (DESIGN-3.md: 12-14px weight 500 uppercase) */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-display-halyard text-sm tracking-wider text-[#ffedd7] group-hover:text-white transition-colors">
            {settings.brandName || 'AURELIA LAURENT'}
          </span>
          <span className="text-[10px] font-mono text-[#6c5f51] uppercase hidden sm:inline-block">
            / 2026 EDITION
          </span>
        </Link>

        {/* Center/Right: Navigation Items in 12px weight 500 uppercase */}
        <nav className="hidden lg:flex items-center gap-8">
          {regularNav.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="font-display-halyard text-xs tracking-wider text-[#ffedd7]/80 hover:text-[#ffedd7] transition-all relative py-1 hover:border-b hover:border-dashed hover:border-[#40372e]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Ghost Admin Button & Pill Booking CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin"
            className="btn-ghost-cream text-[11px] py-1.5 px-3 flex items-center gap-1.5"
            title="Open Dynamic CMS Studio"
          >
            <Shield className="w-3 h-3 text-[#dc5000]" />
            CMS ADMIN
          </Link>

          {ctaItem && (
            <a
              href={ctaItem.url}
              className="btn-pill-bark text-xs py-2 px-4 flex items-center gap-1"
            >
              <span>{ctaItem.label}</span>
              <ArrowUpRight className="w-3 h-3 text-[#dc5000]" />
            </a>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#ffedd7] hover:text-[#dc5000] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-[#100904]/98 backdrop-blur-2xl z-50 p-8 flex flex-col justify-between border-t border-[#40372e]">
          <div className="flex flex-col gap-6 pt-4">
            {visibleNav.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display-halyard text-2xl text-[#ffedd7] hover:text-[#dc5000] transition-colors border-b border-[#40372e] pb-3 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#6c5f51]" />
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-[#40372e] flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-ghost-cream text-center py-2.5"
            >
              Open Dynamic CMS Admin
            </Link>
            <div className="text-center font-mono text-[10px] text-[#6c5f51] uppercase">
              {settings.bottomBarStatusText}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
