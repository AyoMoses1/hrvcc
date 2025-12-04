import { z } from 'zod';
import { STATES, USER_CATEGORIES } from '@/lib/constants';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum(USER_CATEGORIES),
  location: z.string().min(2, 'Location is required'),
  country: z.enum(STATES),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500),
  skills: z.array(z.string()).max(10, 'Maximum 10 skills allowed').optional(),
  services: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, 'Service name must be at least 2 characters'),
        description: z.string().max(500, 'Description must be less than 500 characters').optional(),
        image: z.string().url('Invalid URL').optional().or(z.literal('')),
        price: z.string().optional(),
      }),
    )
    .max(10, 'Maximum 10 services allowed')
    .optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  image: z.string().url('Invalid URL').optional().or(z.literal('')),
  banner: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;

