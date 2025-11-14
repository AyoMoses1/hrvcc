import Link from 'next/link';
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">HRVCC</span>
          </div>
          <span className="hidden font-bold sm:inline-block">HRVCC Member Directory</span>
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
