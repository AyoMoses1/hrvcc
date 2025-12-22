'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BusinessProfile } from '@/features/profiles/components/business-profile';
import { useBusiness } from '@/hooks/use-businesses';
import { Loader2, Building2, AlertCircle, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Support both slug and UUID for backward compatibility
  const { data: business, isLoading, error } = useBusiness(params.id);
  const { user: currentUser } = useAuth();

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Loading business profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !business) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="mx-auto max-w-md px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Business Not Found</h1>
            <p className="mb-6 text-muted-foreground">
              The business profile you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link href="/explore">Browse Businesses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Block access if business is suspended or KYC status is pending
  // Block ALL users (including owners and admins) from viewing pending businesses via public link
  const isSuspended = business.suspended === true;
  const isPendingKYC = business.kycStatus === 'pending';

  // Block if suspended or pending KYC
  if (isSuspended || isPendingKYC) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="mx-auto max-w-md px-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShieldX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">
              {isSuspended ? 'Business Suspended' : 'Invalid Request'}
            </h1>
            <p className="mb-6 text-muted-foreground">
              {isSuspended
                ? 'This business profile has been suspended and is not available for viewing.'
                : 'This business profile is pending verification and cannot be accessed at this time.'}
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link href="/explore">Browse Businesses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <BusinessProfile business={business} />
      </main>
      <Footer />
    </>
  );
}
