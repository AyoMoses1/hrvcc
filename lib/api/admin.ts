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
  verifyBusiness: async (id: string, verified: boolean): Promise<void> => {
    await apiClient.patch(`/businesses/${id}/verify`, { verified });
  },
  suspendBusiness: async (id: string, suspended: boolean): Promise<void> => {
    await apiClient.patch(`/businesses/${id}/suspend`, { suspended });
  },
  sendPasswordReset: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(`/users/${id}/reset-password`);
    return response.data;
  },
  deleteBusiness: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/businesses/${id}`);
    return response.data;
  },
};
