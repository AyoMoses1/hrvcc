'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PublicProfile } from '@/features/profiles/components/public-profile';
import { useUser } from '@/hooks/use-users';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: user, isLoading, error } = useUser(params.id);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !user) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <PublicProfile user={user} />
      </main>
      <Footer />
    </>
  );
}

