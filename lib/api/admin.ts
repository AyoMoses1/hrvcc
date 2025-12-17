import { apiClient } from './axios';

export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalBusinesses: number;
  totalOrganizations: number;
  totalStaff?: number;
  totalJobs: number;
  activeUsers: number;
  revenue: number;
  recentRegistrations: Array<{
    id: string;
    name: string;
    email: string;
    category: string;
    createdAt: string;
  }>;
  pendingVerifications: Array<{
    id: string;
    name: string;
    email: string;
    kycStatus: string;
    createdAt: string;
  }>;
  suspendedUsers?: Array<{
    id: string;
    name: string;
    email: string;
    category: string;
    suspended: boolean;
    updatedAt: string;
  }>;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>('/admin/stats');
    return response.data;
  },
};
