import { Metadata } from 'next';
import { SettingsPage } from '@/features/admin/components/settings-page';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage HRVCC platform settings',
};

export default function Settings() {
  return <SettingsPage />;
}
