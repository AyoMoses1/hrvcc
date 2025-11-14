import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/features/auth/components/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your HRVCC account',
};

export default function SignUpPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-10">
      <Link href="/" className="mb-8 flex items-center space-x-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">HRVCC</span>
        </div>
        <span className="text-xl font-bold">HRVCC Member Directory</span>
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Join the HRVCC Member Directory</p>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
