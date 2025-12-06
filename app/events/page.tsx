import { Metadata } from 'next';
import { EventsPage } from '@/features/events/components/events-page';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Events Calendar',
  description: 'View and filter HRVCC events calendar',
};

export default function Events() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <EventsPage />
      </main>
      <Footer />
    </>
  );
}
