import { apiClient } from './axios';

export interface Job {
  id: string;
  title: string;
  description?: string;
  requirements?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location?: string;
  salary?: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    businessProfile?: {
      businessName: string;
    };
  };
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDto {
  title: string;
  description?: string;
  requirements?: string;
  type?: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location?: string;
  salary?: string;
}

export const jobsApi = {
  getAll: async (approvedOnly: boolean = true): Promise<Job[]> => {
    const { data } = await apiClient.get<Job[]>('/jobs', {
      params: { approvedOnly },
    });
    return data;
  },

  getById: async (id: string): Promise<Job> => {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`);
    return data;
  },

  create: async (jobData: CreateJobDto): Promise<Job> => {
    const { data } = await apiClient.post<Job>('/jobs', jobData);
    return data;
  },

  approve: async (id: string): Promise<Job> => {
    const { data } = await apiClient.patch<Job>(`/jobs/${id}/approve`);
    return data;
  },

  reject: async (id: string, reason?: string): Promise<Job> => {
    const { data } = await apiClient.patch<Job>(`/jobs/${id}/reject`, { reason });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/jobs/${id}`);
  },
};
