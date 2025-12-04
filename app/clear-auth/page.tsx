'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ClearAuthPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
      sessionStorage.clear();
    }
  }, []);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Auth Data Cleared</h1>
        <p className="text-muted-foreground">
          All authentication tokens have been removed from your browser.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Button onClick={() => router.push('/')}>Go to Home</Button>
          <Button variant="outline" onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}


