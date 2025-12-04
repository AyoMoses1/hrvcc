'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-muted/40">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Admin Panel</h2>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/analytics"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Analytics
              </Link>
              <Link
                href="/admin/categories"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Categories
              </Link>
              <Link
                href="/admin/businesses"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Businesses
              </Link>
              <Link
                href="/admin/users"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Users
              </Link>
              <Link
                href="/admin/jobs"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Jobs
              </Link>
              <Link
                href="/admin/settings"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Settings
              </Link>
            </nav>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
