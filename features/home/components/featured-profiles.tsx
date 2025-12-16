'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Loader2 } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';

export function FeaturedProfiles() {
  const { data: usersData, isLoading, error } = useUsers({ page: 1, limit: 4 });
  const users = usersData?.data || [];

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
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No members to display yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {users.slice(0, 4).map((user) => (
              <Card key={user.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {user.name.charAt(0)}
                    </div>
                    {user.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <h3 className="mb-1 font-semibold">{user.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{user.title}</p>

                  <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{user.location}</span>
                    </div>
                    {user.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{user.rating}</span>
                      </div>
                    )}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {user.category}
                  </Badge>
                </CardContent>

                <CardFooter className="border-t bg-muted/50 p-4">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href={`/profile/${(user as any).slug || user.id}`}>View Profile</Link>
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
