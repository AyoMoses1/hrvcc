import { Metadata } from 'next';
import { EventsPage } from '@/features/events/components/events-page';

export const metadata: Metadata = {
  title: 'Events Calendar',
  description: 'View and filter HRVCC events calendar',
};

export default function Events() {
  return <EventsPage />;
}
