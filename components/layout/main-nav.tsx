'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Member Directory' },
  { href: '/events', label: 'Events' },
  { href: '/member-plans', label: 'Plans' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === item.href ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
