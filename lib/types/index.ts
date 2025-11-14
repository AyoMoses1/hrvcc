export interface User {
  id: string;
  name: string;
  title: string;
  category: 'Professional' | 'Business' | 'Organization';
  location: string;
  country: string;
  image: string;
  bio: string;
  skills?: string[];
  services?: string[];
  verified: boolean;
  rating?: number;
  reviews?: number;
  website?: string;
  linkedin?: string;
  twitter?: string;
  joinedDate: string;
  // CSV fields for member directory
  businessCategory?: string;
  lastName?: string;
  firstName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  fax?: string;
  textingNumber?: string;
  textingKeyword?: string;
  url?: string;
  email?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  createdBy: string;
  createdAt: Date;
}

export interface MemberPlan {
  id: string;
  category: string;
  name: string;
  pricing: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
  };
  features: string[];
  description?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  applicationUrl?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProfessionals: number;
  totalBusinesses: number;
  totalOrganizations: number;
  totalJobs: number;
  activeUsers: number;
  newUsersThisMonth: number;
  revenue?: number;
}
