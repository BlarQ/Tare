import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#100904',
};

export const metadata: Metadata = {
  title: 'Tare Precious — Event Planning & Delivery',
  description:
    'Ephemeral sovereign worlds engineered for imperial weddings, presidential state galas, and monumental milestone celebrations across Lagos, Abuja, London, and Dubai.',
  keywords: [
    'luxury event planner Lagos',
    'Tare Precious',
    'scenography Nigeria',
    '3D event visualizer',
    'imperial wedding planner',
    'presidential state gala production',
    'Victoria Island luxury events'
  ],
  authors: [{ name: 'Tare Precious' }],
  openGraph: {
    title: 'Tare Precious — Event Planning & Delivery',
    description:
      'Ephemeral sovereign worlds engineered for imperial weddings, presidential state galas, and monumental celebrations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-[#100904] text-[#ffedd7] antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#100904] text-[#ffedd7] selection:bg-[#dc5000] selection:text-[#ffedd7] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

