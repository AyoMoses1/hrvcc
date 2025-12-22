'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { jobsApi, CreateJobDto } from '@/lib/api/jobs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const jobFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  requirements: z.string().optional(),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote']).optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export function CreateJobForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      type: 'Full-time',
      location: '',
      salary: '',
    },
  });

  const jobType = watch('type');

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);

      const jobData: CreateJobDto = {
        title: data.title,
        description: data.description || undefined,
        requirements: data.requirements || undefined,
        type: data.type,
        location: data.location || undefined,
        salary: data.salary || undefined,
      };

      await jobsApi.create(jobData);

      toast.success('Job posted successfully! It will appear on the job board after admin approval.');
      reset();
      setOpen(false);
      
      // Optionally refresh the page or navigate
      router.refresh();
    } catch (error: any) {
      console.error('Failed to create job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Post a Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>
            Create a job posting. Your job will be reviewed by an admin before it appears on the job board.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Senior Software Engineer"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select
              value={jobType}
              onValueChange={(value) => setValue('type', value as JobFormValues['type'])}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Houston, TX or Remote"
              {...register('location')}
            />
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              placeholder="e.g., $50,000 - $70,000 or Competitive"
              {...register('salary')}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              rows={6}
              {...register('description')}
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="List the required qualifications, skills, and experience..."
              rows={4}
              {...register('requirements')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

