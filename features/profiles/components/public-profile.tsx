'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Star,
  Eye,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Award,
  Users,
} from 'lucide-react';
import { User } from '@/lib/types';
import Link from 'next/link';

interface PublicProfileProps {
  user: User;
}

export function PublicProfile({ user }: PublicProfileProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="relative">
        <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          {user.banner ? (
            <img
              src={user.banner}
              alt={`${user.name} banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
          ) : null}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-secondary/40 ${
              user.banner ? 'hidden' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-20 md:-mt-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative">
                {user.image ? (
                  <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-4xl md:text-5xl font-bold text-primary-foreground">
                              ${user.name.charAt(0).toUpperCase()}
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary text-4xl md:text-5xl font-bold text-primary-foreground shadow-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow-lg">
                    <CheckCircle2 className="h-6 w-6 md:h-7 md:w-7 text-primary fill-primary" />
                  </div>
                )}
              </div>
              <div className="pb-2 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user.name}</h1>
                  {user.verified && (
                    <Badge variant="secondary" className="text-xs font-semibold">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg md:text-xl text-muted-foreground font-medium">{user.title}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">
                      {user.location}, {user.country}
                    </span>
                  </div>
                  {user.rating && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {user.rating.toFixed(1)} <span className="text-muted-foreground">({user.reviews} reviews)</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pb-2">
              <Button size="lg" className="shadow-md">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button size="lg" variant="outline" className="shadow-md">
                Connect
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <h2 className="text-2xl font-bold">About</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {user.bio}
                </p>
              </CardContent>
            </Card>

            {user.skills && user.skills.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">Skills & Expertise</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {user.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {user.services && user.services.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">Services Offered</h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {user.services.map((service: any, index: number) => {
                      const serviceData = typeof service === 'string' 
                        ? { id: `service-${index}`, name: service }
                        : service;
                      return (
                      <Link
                        key={serviceData.id || `service-${index}`}
                        href={`/profile/${user.id}/service/${serviceData.id || index}`}
                        className="group"
                      >
                        <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          {serviceData.image ? (
                            <div className="relative h-48 w-full overflow-hidden">
                              <img
                                src={serviceData.image}
                                alt={serviceData.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.parentElement) {
                                    target.parentElement.innerHTML = `
                                      <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <Briefcase class="h-12 w-12 text-muted-foreground" />
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                              <Briefcase className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                              {serviceData.name}
                            </h3>
                            {serviceData.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {serviceData.description}
                              </p>
                            )}
                            {serviceData.price && (
                              <p className="text-sm font-semibold text-primary">{serviceData.price}</p>
                            )}
                            <div className="mt-3 text-xs text-primary font-medium group-hover:underline">
                              View Details →
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Quick Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <Badge variant="outline" className="text-sm font-semibold">
                      {user.category}
                    </Badge>
                  </div>

                  {(user.website || user.linkedin || user.twitter) && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Connect
                      </p>
                      <div className="space-y-2">
                        {user.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              Website
                            </span>
                          </a>
                        )}
                        {user.linkedin && (
                          <a
                            href={user.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              LinkedIn
                            </span>
                          </a>
                        )}
                        {user.twitter && (
                          <a
                            href={user.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              Twitter
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Activity
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="font-semibold">
                          {new Date(user.joinedDate || Date.now()).getFullYear()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Profile views</span>
                        <span className="font-semibold">234</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

