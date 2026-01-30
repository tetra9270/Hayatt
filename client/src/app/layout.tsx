import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { CurrencyProvider } from '@/context/CurrencyContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hayatt Store | Premium 3D E-Commerce',
  description: 'Experience the future of shopping with Hayatt Store. Premium gear, immersive 3D visualization, and next-gen user experience.',
  openGraph: {
    title: 'Hayatt Store | Premium 3D E-Commerce',
    description: 'Experience the future of shopping.',
    url: 'https://hayatt-store.com',
    siteName: 'Hayatt Store',
    images: [
      {
        url: 'https://nexus-store.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hayatt Store',
    description: 'Experience the future of shopping.',
  },
};

import Auth3DScene from '@/components/Auth3DScene';

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-transparent antialiased selection:bg-primary/20")}>
        <div className="fixed inset-0 z-[-1]">
          <Auth3DScene />
        </div>
        <CurrencyProvider>
          <Navbar />
          {children}
          <Toaster position="top-center" richColors theme="dark" />
        </CurrencyProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
