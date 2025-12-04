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

export default function ServiceDetailsPage({
  params,
}: {
  params: { id: string; serviceId: string };
}) {
  const { data: user, isLoading, error } = useUser(params.id);
  const { user: currentUser } = useAuth();
  const service = user?.services?.find((s) => s.id === params.serviceId) || 
                  (user?.services && !isNaN(parseInt(params.serviceId)) 
                    ? user.services[parseInt(params.serviceId)] 
                    : undefined);

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
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg overflow-hidden">
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
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{service.name}</h1>
                      {service.price && (
                        <p className="text-2xl font-semibold text-primary">{service.price}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {user.category}
                    </Badge>
                  </div>

                  {service.description && (
                    <div className="prose prose-sm max-w-none mb-6">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {service.description}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-6 border-t">
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
              <Card className="border-0 shadow-lg sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    {user.image ? (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-background">
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
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xl font-bold text-primary-foreground border-2 border-background">
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

                    <div className="pt-3 border-t">
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

