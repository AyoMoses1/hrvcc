import { Metadata } from 'next';
import { ReportsPage } from '@/features/admin/components/reports-page';

export const metadata: Metadata = {
  title: 'Reports',
  description: 'View and manage HRVCC reports and analytics',
};

export default function Reports() {
  return <ReportsPage />;
}
