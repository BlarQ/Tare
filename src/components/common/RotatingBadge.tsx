'use client';

import React from 'react';

interface RotatingBadgeProps {
  brandName?: string;
  monogram?: string;
  className?: string;
  size?: number;
  textColor?: string;
  bgColor?: string;
  accentColor?: string;
}

export default function RotatingBadge({
  brandName = 'ATELIER VENDÔME · SCENOGRAPHY · ',
  monogram = 'AV',
  className = '',
  size = 110,
  textColor = '#000000',
  bgColor = '#ffffff',
  accentColor = '#ee3a49',
}: RotatingBadgeProps) {
  // SVG circular text path setup
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <div
        className="absolute inset-0 rounded-full shadow-2xl transition-transform duration-500 hover:scale-105"
        style={{ backgroundColor: bgColor }}
      />

      {/* Rotating SVG text */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full animate-spin-slow"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text
          fill={textColor}
          fontSize="9.2"
          fontWeight="600"
          letterSpacing="2.2"
          fontFamily="var(--font-mono)"
        >
          <textPath xlinkHref="#circlePath" startOffset="0%">
            {brandName.repeat(2)}
          </textPath>
        </text>
      </svg>

      {/* Center Monogram & Accent */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span
          className="text-base font-bold tracking-tighter"
          style={{
            color: textColor,
            fontFamily: 'var(--font-sans)',
          }}
        >
          {monogram}
        </span>
        <div
          className="w-1.5 h-1.5 rounded-full mt-0.5"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
