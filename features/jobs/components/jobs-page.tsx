'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import { mockJobs } from '@/lib/data/mock-data';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">
          Explore job opportunities from veteran-owned businesses and organizations in the Houston region
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, company, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredJobs.length} jobs
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2">{job.title}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
                </div>
                <Badge>{job.type}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRelativeTime(job.postedDate)}</span>
                </div>
              </div>

              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>

              <div className="flex flex-wrap gap-2">
                {job.requirements.slice(0, 3).map((req) => (
                  <Badge key={req} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {job.requirements.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.requirements.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/50">
              <div className="flex w-full gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Save
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">
            No jobs found. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}

