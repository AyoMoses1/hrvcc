import { apiClient } from './axios';
import { User } from '@/lib/types';

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface UpdateUserData {
  name?: string;
  title?: string;
  category?: 'Business' | 'Organization' | 'Staff';
  location?: string;
  country?: string;
  bio?: string;
  skills?: string[];
  services?: Array<{
    id?: string;
    name: string;
    description?: string;
    image?: string;
    price?: string;
  }>;
  website?: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
  banner?: string;
}

export const usersApi = {
  getAll: async (params?: PaginationParams): Promise<UsersResponse> => {
    const { data } = await apiClient.get<UsersResponse>('/users', { params });
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  update: async (id: string, updateData: UpdateUserData): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, updateData);
    return data;
  },
};
