import { Metadata } from 'next';
import { AdminDashboard } from '@/features/admin/components/admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your HRVCC platform',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
