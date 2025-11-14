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
} from 'lucide-react';
import { User } from '@/lib/types';

interface PublicProfileProps {
  user: User;
}

export function PublicProfile({ user }: PublicProfileProps) {
  return (
    <div className="container py-8">
      {/* Cover Image */}
      <div className="mb-8 h-48 w-full rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20" />

      {/* Profile Header */}
      <div className="-mt-24 mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-primary text-4xl font-bold text-primary-foreground">
              {user.name.charAt(0)}
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {user.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground">{user.title}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {user.location}, {user.country}
                  </span>
                </div>
                {user.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {user.rating} ({user.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pb-2">
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          {/* About */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">About</h2>
              <p className="text-muted-foreground">{user.bio}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          {user.services && user.services.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {user.services.map((service) => (
                    <Badge key={service} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Links</h2>
              <div className="space-y-3">
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={user.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Category</h2>
              <Badge className="text-sm">{user.category}</Badge>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">
                    {new Date(user.joinedDate).getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile views</span>
                  <span className="font-medium">234</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

