import { Metadata } from 'next';
import { BusinessesPage } from '@/features/admin/components/businesses-page';

export const metadata: Metadata = {
  title: 'Businesses',
  description: 'Manage HRVCC member businesses',
};

export default function Businesses() {
  return <BusinessesPage />;
}
