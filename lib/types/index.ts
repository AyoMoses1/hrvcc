export interface BusinessProfile {
  businessName: string;
  category2?: string;
  position?: string;
  websiteUrl?: string;
  phone?: string;
  secondaryPhone?: string;
  fax?: string;
  description?: string;
  veteranOwnedBusiness?: boolean;
  branchOfService?: string;
  branches?: string[];
  referredBy?: string;
  other?: string;
  // Business profile fields moved from users
  title?: string;
  location?: string;
  country?: string;
  bio?: string;
  banner?: string;
  rating?: number;
  reviews?: number;
  skills?: string[];
  services?: Array<
    | string
    | {
        id: string;
        name: string;
        description?: string;
        image?: string;
        price?: string;
      }
  >;
  website?: string;
  linkedin?: string;
  twitter?: string;
}

export interface User {
  id: string;
  slug?: string; // URL-friendly identifier
  firstName: string;
  lastName: string;
  name?: string; // Computed full name for backward compatibility
  category: 'Business' | 'Organization';
  image?: string;
  verified: boolean;
  joinedDate?: string;
  email?: string;
  // Admin and status fields
  suspended?: boolean;
  kycStatus?: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  kycVerified?: boolean; // Computed from kycStatus === 'approved'
  createdAt?: string | Date;
  // Business profile data
  businessProfile?: BusinessProfile;
  // Convenience fields (from businessProfile or direct)
  title?: string; // From businessProfile.title
  location?: string; // From businessProfile.location
  country?: string; // From businessProfile.country
  bio?: string; // From businessProfile.bio
  skills?: string[]; // From businessProfile.skills
  rating?: number; // Rating/review score
  reviews?: number; // Number of reviews
  website?: string; // From businessProfile.website
  linkedin?: string; // LinkedIn URL
  services?: Array<
    | string
    | {
        id: string;
        name: string;
        description?: string;
        image?: string;
        price?: string;
      }
  >; // From businessProfile.services
  // CSV fields for member directory (legacy)
  businessCategory?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string; // Phone number
  textingNumber?: string;
  textingKeyword?: string;
  url?: string;
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
  totalStaff: number;
  totalBusinesses: number;
  totalOrganizations: number;
  totalJobs: number;
  activeUsers: number;
  newUsersThisMonth: number;
  revenue?: number;
}
