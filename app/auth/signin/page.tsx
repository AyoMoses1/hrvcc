'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInForm } from '@/features/auth/components/sign-in-form';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <Image
          src="/logos/img-639---logo-1.png"
          alt="HRVCC Logo"
          width={350}
          height={75}
          className="h-20 w-auto object-contain"
          priority
        />
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
