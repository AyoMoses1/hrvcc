'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserNav() {
  // Frontend only - no real auth
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
