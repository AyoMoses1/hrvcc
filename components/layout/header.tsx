import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="animate-slide-in sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src="/logos/1.png"
            alt="HRVCC Logo"
            width={400}
            height={85}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <MainNav />

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
