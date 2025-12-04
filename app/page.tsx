'use client';

import { useEffect } from 'react';
import { Hero } from '@/features/home/components/hero';
import { Stats } from '@/features/home/components/stats';
import { FeaturedProfiles } from '@/features/home/components/featured-profiles';
import { CTA } from '@/features/home/components/cta';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  useEffect(() => {
    console.log('Home page loaded');
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 min-h-screen">
        <Hero />
        <Stats />
        <FeaturedProfiles />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
