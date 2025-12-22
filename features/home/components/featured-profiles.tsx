'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Loader2 } from 'lucide-react';
import { useBusinesses } from '@/hooks/use-businesses';

export function FeaturedProfiles() {
  const {
    data: businessesData,
    isLoading,
    error,
  } = useBusinesses({
    page: 1,
    limit: 4,
    // Only show businesses with completed KYC (verified = true means kycStatus = 'approved')
    verified: true,
  });
  const businesses = businessesData?.data || [];

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Featured Members</h2>
          <p className="text-lg text-muted-foreground">
            Discover veteran-owned businesses and innovative services in the Houston region
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">
              Unable to load featured members. Please try again later.
            </p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No businesses to display yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {businesses.slice(0, 4).map((business) => (
              <Card key={business.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {business.businessName.charAt(0).toUpperCase()}
                    </div>
                    {business.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-1 font-semibold">{business.businessName}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {business.title || business.description}
                  </p>

                  <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{business.location || business.officeAddress?.city}</span>
                    </div>
                    {business.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{business.rating}</span>
                      </div>
                    )}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {business.category}
                  </Badge>
                </CardContent>

                <CardFooter className="border-t bg-muted/50 p-4">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href={`/profile/${business.slug || business.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/explore">View All Members</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
