'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

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
  const { user } = useAuth();

  // Filter nav items based on authentication
  const visibleNavItems = navItems.filter((item) => {
    // Only show Jobs to logged-in users
    if (item.href === '/jobs') {
      return !!user;
    }
    return true;
  });

  // Add Jobs if user is logged in
  const allNavItems = user
    ? [...navItems.slice(0, 3), { href: '/jobs', label: 'Jobs' }, ...navItems.slice(3)]
    : navItems;

  return (
    <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
      {allNavItems.map((item) => (
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
