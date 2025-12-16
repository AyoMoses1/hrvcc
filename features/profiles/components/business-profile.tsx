'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Star,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Award,
  Phone,
  Mail,
  Building2,
  User,
  Calendar,
  Shield,
  FileText,
  ExternalLink,
  Clock,
  Share2,
  Heart,
  Info,
} from 'lucide-react';
import { Business } from '@/lib/api/businesses';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BusinessProfileProps {
  business: Business;
}

export function BusinessProfile({ business }: BusinessProfileProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Handle contact button click - require login
  const handleContactClick = () => {
    if (!user) {
      toast.error('Please sign in to contact this business');
      router.push('/auth/signin');
      return;
    }
    // TODO: Open contact form/modal
    toast.info('Contact functionality coming soon');
  };

  // Format website URL
  const formatWebsiteUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const websiteUrl = formatWebsiteUrl(business.websiteUrl);

  // Get display name
  const displayName =
    business.businessName || business.contactPerson?.fullName || 'Business Profile';

  // Get location string
  const locationString = business.officeAddress
    ? `${business.officeAddress.city}, ${business.officeAddress.state}`
    : business.location || null;

  // Get initials for avatar
  const getInitials = () => {
    if (business.businessName) {
      return business.businessName
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return 'BP';
  };

  // Check if profile has substantial content
  const hasDescription = business.description && business.description.length > 10;
  const hasContactInfo = business.email || business.phone || websiteUrl;
  const hasAddress = business.officeAddress?.addressLine1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section with Banner */}
      <div className="relative">
        <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
          {business.banner ? (
            <img
              src={business.banner}
              alt={`${displayName} banner`}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : null}
          {/* Gradient overlay for visual interest even without banner */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-secondary/60 ${
              business.banner ? 'opacity-40' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Pattern overlay for visual interest */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Profile Header */}
        <div className="container relative -mt-24 md:-mt-32">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Logo and Business Name */}
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
              <div className="relative">
                {business.image ? (
                  <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-4 border-background bg-white shadow-2xl md:h-44 md:w-44">
                    <img
                      src={business.image}
                      alt={displayName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-4xl md:text-5xl font-bold text-white">
                              ${getInitials()}
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-white shadow-2xl md:h-44 md:w-44 md:text-5xl">
                    {getInitials()}
                  </div>
                )}
                {business.verified && (
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-2 shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-3 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                    {displayName}
                  </h1>
                  {business.verified && (
                    <Badge className="bg-green-500 text-sm hover:bg-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                {business.category2 && (
                  <p className="text-xl font-medium text-muted-foreground">{business.category2}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {locationString && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{locationString}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="font-medium">
                      {business.category}
                    </Badge>
                  </div>
                  {business.veteranOwnedBusiness && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      <Shield className="mr-1 h-3 w-3" />
                      Veteran Owned
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-4">
              <Button size="lg" className="shadow-md" onClick={handleContactClick}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
              {websiteUrl && (
                <Button size="lg" variant="outline" className="shadow-md" asChild>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}
              <Button size="lg" variant="ghost" className="shadow-md">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  About {displayName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {hasDescription ? (
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {business.description}
                  </p>
                ) : (
                  <div className="rounded-lg bg-muted/50 p-6 text-center">
                    <Info className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Welcome to {displayName}! We're a{' '}
                      <span className="font-medium">{business.category}</span>
                      {business.category2 && (
                        <>
                          {' '}
                          specializing in <span className="font-medium">{business.category2}</span>
                        </>
                      )}
                      .
                      {locationString && (
                        <>
                          {' '}
                          Based in <span className="font-medium">{locationString}</span>.
                        </>
                      )}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground/70">
                      More details coming soon. Feel free to reach out to learn more about us!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Person Section */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Contact Person
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {business.contactPerson ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-bold text-primary">
                      {business.contactPerson.firstName?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-xl font-semibold">
                        {business.contactPerson.title && `${business.contactPerson.title} `}
                        {business.contactPerson.fullName ||
                          `${business.contactPerson.firstName} ${business.contactPerson.lastName}`}
                        {business.contactPerson.suffix && `, ${business.contactPerson.suffix}`}
                      </h3>
                      {business.contactPerson.position && (
                        <p className="text-muted-foreground">{business.contactPerson.position}</p>
                      )}
                      <div className="flex flex-wrap gap-4 pt-3">
                        {business.email && (
                          <a
                            href={`mailto:${business.email}`}
                            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
                          >
                            <Mail className="h-4 w-4" />
                            {business.email}
                          </a>
                        )}
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
                          >
                            <Phone className="h-4 w-4" />
                            {business.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-bold text-primary">
                      <User className="h-8 w-8" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold">{displayName}</h3>
                      <div className="flex flex-wrap gap-4 pt-2">
                        {business.email && (
                          <a
                            href={`mailto:${business.email}`}
                            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
                          >
                            <Mail className="h-4 w-4" />
                            {business.email}
                          </a>
                        )}
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
                          >
                            <Phone className="h-4 w-4" />
                            {business.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Section */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Office Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {hasAddress ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <p className="mb-1 text-sm font-medium text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {business.officeAddress!.addressLine1}
                          {business.officeAddress!.addressLine2 && (
                            <>, {business.officeAddress!.addressLine2}</>
                          )}
                        </p>
                        <p className="text-muted-foreground">
                          {business.officeAddress!.city}, {business.officeAddress!.state}{' '}
                          {business.officeAddress!.zipCode}
                        </p>
                        {business.officeAddress!.county && (
                          <p className="text-sm text-muted-foreground">
                            {business.officeAddress!.county} County
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {business.officeAddress!.country || 'United States'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {business.phone && (
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Phone</p>
                          <a
                            href={`tel:${business.phone}`}
                            className="flex items-center gap-1.5 font-medium text-primary hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {business.phone}
                          </a>
                        </div>
                      )}
                      {business.secondaryPhone && (
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">
                            Secondary Phone
                          </p>
                          <a
                            href={`tel:${business.secondaryPhone}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {business.secondaryPhone}
                          </a>
                        </div>
                      )}
                      {business.fax && (
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Fax</p>
                          <p className="font-medium">{business.fax}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/50 p-6 text-center">
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      {locationString ? (
                        <>
                          Located in <span className="font-medium">{locationString}</span>
                        </>
                      ) : (
                        'Location details coming soon'
                      )}
                    </p>
                    {(business.phone || business.email) && (
                      <div className="mt-4 flex justify-center gap-4">
                        {business.email && (
                          <a
                            href={`mailto:${business.email}`}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <Mail className="h-4 w-4" />
                            Email Us
                          </a>
                        )}
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            Call Us
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            {business.services && business.services.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {business.services.map((service, index) => {
                      // Handle both string and object services
                      if (typeof service === 'string') {
                        return (
                          <div
                            key={index}
                            className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                          >
                            <h4 className="font-semibold">{service}</h4>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={service.id || index}
                          className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                        >
                          <h4 className="mb-2 font-semibold">{service.name}</h4>
                          {service.description && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          )}
                          {service.price && (
                            <p className="mt-2 text-sm font-semibold text-primary">
                              {service.price}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills/Expertise Section */}
            {business.skills && business.skills.length > 0 && (
              <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-wrap gap-2">
                    {business.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact Card */}
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-lg">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="truncate text-sm font-medium">{business.email}</p>
                    </div>
                  </a>
                )}

                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{business.phone}</p>
                    </div>
                  </a>
                )}

                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                  >
                    <div className="rounded-full bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-muted-foreground">Website</p>
                      <p className="truncate text-sm font-medium">{business.websiteUrl}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}

                {!hasContactInfo && (
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Contact information will be available soon.
                    </p>
                  </div>
                )}

                {(business.linkedin || business.twitter) && (
                  <>
                    <Separator />
                    <div className="flex gap-3">
                      {business.linkedin && (
                        <a
                          href={business.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span className="text-sm font-medium">LinkedIn</span>
                        </a>
                      )}
                      {business.twitter && (
                        <a
                          href={business.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted"
                        >
                          <Twitter className="h-4 w-4" />
                          <span className="text-sm font-medium">Twitter</span>
                        </a>
                      )}
                    </div>
                  </>
                )}

                <Separator />

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={handleContactClick}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Heart className="mr-2 h-4 w-4" />
                    Save Business
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="text-lg">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="outline">{business.category}</Badge>
                </div>

                {business.category2 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Industry</span>
                    <span className="max-w-[60%] text-right text-sm font-medium">
                      {business.category2}
                    </span>
                  </div>
                )}

                {business.veteranOwnedBusiness && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Veteran Owned</span>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      <Shield className="mr-1 h-3 w-3" />
                      Yes
                    </Badge>
                  </div>
                )}

                {business.branchOfService && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Branch</span>
                    <span className="text-sm font-medium">{business.branchOfService}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {business.verified ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending Verification</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Calendar className="h-3 w-3" />
                    {new Date(business.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {business.lastLogin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Active</span>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <Clock className="h-3 w-3" />
                      {new Date(business.lastLogin).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}

                {business.rating !== undefined && business.rating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {business.rating.toFixed(1)}
                      <span className="text-muted-foreground">({business.reviews})</span>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents Card (if any) */}
            {business.documents && business.documents.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    {business.documents
                      .filter((doc) => doc.documentType !== 'profile_photo')
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 rounded-lg bg-muted/50 p-2"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1 truncate text-sm font-medium">{doc.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.documentType.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Referral Info */}
            {business.referredBy && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Referred by: <span className="font-medium">{business.referredBy}</span>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
