'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Download,
  Briefcase,
  MapPin,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi, Job } from '@/lib/api/jobs';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'pending'
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['admin-jobs', selectedStatus],
    queryFn: async () => {
      try {
        // Fetch all jobs (not just approved) for admin
        const allJobs = await jobsApi.getAll(false);
        return { jobs: allJobs };
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        return { jobs: [] as Job[] };
      }
    },
  });

  const jobs = jobsData?.jobs || [];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.user?.businessProfile?.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApprove = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      await jobsApi.approve(jobId);
      toast.success('Job approved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve job');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedJob) return;
    try {
      setActionLoading(selectedJob.id);
      await jobsApi.reject(selectedJob.id, rejectionReason);
      toast.success('Job rejected');
      setRejectDialogOpen(false);
      setSelectedJob(null);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject job');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Jobs Management</h1>
          <p className="text-muted-foreground">
            Manage job postings and applications ({filteredJobs.length} total)
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or company..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
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
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No jobs found.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Job posting functionality will be available soon.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge variant="outline">{job.type}</Badge>
                      {job.status === 'pending' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                      {job.status === 'approved' && (
                        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </Badge>
                      )}
                      {job.status === 'rejected' && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                    <p className="mb-2 text-muted-foreground">
                      {job.user?.businessProfile?.businessName ||
                        `${job.user?.firstName} ${job.user?.lastName}`.trim() ||
                        'Company'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {job.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {job.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    {job.status === 'pending' && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(job.id)}
                          disabled={actionLoading === job.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {actionLoading === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setRejectDialogOpen(true);
                          }}
                          disabled={actionLoading === job.id}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this job posting. This will be helpful for the
              job poster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Rejection reason (optional)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={actionLoading === selectedJob?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading === selectedJob?.id ? 'Rejecting...' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
