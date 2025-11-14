import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
            Connecting Houston&apos;s{' '}
            <span className="text-primary">Veteran</span> &{' '}
            <span className="text-primary">Military</span>{' '}
            <span className="text-primary">Businesses</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
            Join the HRVCC network of veteran-owned businesses, military spouses, and first responders
            driving success in the Houston region.
          </p>

          {/* Search Bar */}
          <div className="mb-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search businesses, services, or jobs..."
                className="h-12 pl-10"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Search
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explore">Explore Network</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

