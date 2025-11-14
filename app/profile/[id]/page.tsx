import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PublicProfile } from '@/features/profiles/components/public-profile';
import { mockUsers } from '@/lib/data/mock-data';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View user profile',
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = mockUsers.find((u) => u.id === params.id);

  if (!user) {
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

