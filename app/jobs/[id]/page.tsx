'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  DollarSign,
  Clock,
  Loader2,
  ArrowLeft,
  Building2,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { mockJobs } from '@/lib/data/mock-data';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const job = mockJobs.find((j) => j.id === params.id);

  const similarJobs = mockJobs
    .filter((j) => j.id !== params.id && j.type === job?.type)
    .slice(0, 3);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/signin?redirect=/jobs/${params.id}`);
    }
  }, [user, authLoading, router, params.id]);

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  if (!job) {
    return (
      <>
        <Header />
        <main className="container max-w-3xl py-16 text-center">
          <h1 className="text-2xl font-bold">Job not found</h1>
          <p className="mt-2 text-muted-foreground">This job may have been removed.</p>
          <Button className="mt-6" asChild>
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30">
        <div className="container max-w-4xl py-6">
          {/* Back */}
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Jobs
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                      {job.company.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl font-bold sm:text-2xl">{job.title}</h1>
                      <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="secondary">{job.type}</Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatRelativeTime(job.postedDate)}
                    </span>
                  </div>

                  <Separator className="my-6" />

                  {/* Description */}
                  <div>
                    <h2 className="mb-3 font-semibold">About this role</h2>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>

                  {/* Requirements */}
                  <div className="mt-6">
                    <h2 className="mb-3 font-semibold">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <h2 className="mb-3 font-semibold">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req) => (
                        <Badge key={req} variant="outline">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Apply Card */}
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full" size="lg">
                    Apply Now
                  </Button>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Company Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{job.company}</p>
                      <p className="text-xs text-muted-foreground">Veteran-Owned Business</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Company
                  </Button>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="mb-3 font-medium">Similar Jobs</h3>
                    <div className="space-y-3">
                      {similarJobs.map((similarJob) => (
                        <Link
                          key={similarJob.id}
                          href={`/jobs/${similarJob.id}`}
                          className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                        >
                          <p className="text-sm font-medium">{similarJob.title}</p>
                          <p className="text-xs text-muted-foreground">{similarJob.company}</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {similarJob.location}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
