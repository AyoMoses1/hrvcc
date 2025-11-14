import { Metadata } from 'next';
import { DashboardPage } from '@/features/dashboard/components/dashboard-page';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your HRVCC profile and activities',
};

export default function Dashboard() {
  const mockUser = {
    name: 'Demo User',
    email: 'demo@example.com',
  };

  return <DashboardPage user={mockUser} />;
}
