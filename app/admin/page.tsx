'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/features/admin/components/admin-dashboard';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/signin?redirect=/admin');
        return;
      }
      // Check if user is admin
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return <AdminDashboard />;
}
