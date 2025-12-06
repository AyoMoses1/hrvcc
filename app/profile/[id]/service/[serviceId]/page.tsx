'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, MessageSquare, Briefcase, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/hooks/use-users';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

// Helper type for normalized service
interface ServiceData {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: string;
}

// Helper function to normalize service data
function normalizeService(service: string | ServiceData, index: number): ServiceData {
  if (typeof service === 'string') {
    return { id: `service-${index}`, name: service };
  }
  return service;
}

export default function ServiceDetailsPage({
  params,
}: {
  params: { id: string; serviceId: string };
}) {
  const { data: user, isLoading, error } = useUser(params.id);
  const { user: currentUser } = useAuth();

  // Find and normalize the service
  const rawService = user?.services?.find((s, idx) => {
    if (typeof s === 'string') {
      return `service-${idx}` === params.serviceId || idx.toString() === params.serviceId;
    }
    return s.id === params.serviceId;
  });

  const serviceIndex = user?.services?.indexOf(rawService as any) ?? 0;
  const service = rawService ? normalizeService(rawService, serviceIndex) : undefined;

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading service details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !user || !service) {
    notFound();
  }

  const isOwner = currentUser?.id === user.id;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
        <div className="container py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href={`/profile/${user.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-lg">
                {service.image ? (
                  <div className="relative h-96 w-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                              <Briefcase class="h-24 w-24 text-muted-foreground" />
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Briefcase className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h1 className="mb-2 text-3xl font-bold md:text-4xl">{service.name}</h1>
                      {service.price && (
                        <p className="text-2xl font-semibold text-primary">{service.price}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {user.category}
                    </Badge>
                  </div>

                  {service.description && (
                    <div className="prose prose-sm mb-6 max-w-none">
                      <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 border-t pt-6">
                    <Button size="lg" className="shadow-md">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Provider
                    </Button>
                    {isOwner && (
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/profile/edit">Edit Service</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center gap-3">
                    {user.image ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-background">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `
                                <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-xl font-bold text-primary-foreground">
                                  ${user.name.charAt(0).toUpperCase()}
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-secondary text-xl font-bold text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      {user.verified && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {user.location}, {user.country}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/profile/${user.id}`}>View Full Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
