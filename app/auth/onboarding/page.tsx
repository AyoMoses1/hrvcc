'use client';

import { OnboardingForm } from '@/features/auth/components/onboarding-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function OnboardingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <OnboardingForm />
      </main>
      <Footer />
    </>
  );
}
