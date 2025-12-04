import { apiClient } from './axios';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  category: 'Professional' | 'Business' | 'Organization';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    category?: string;
    role: string;
    [key: string]: any;
  };
  token: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>(
      '/auth/register',
      data,
    );
    return response;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>(
      '/auth/login',
      data,
    );
    return response;
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const { data } = await apiClient.get<AuthResponse['user']>('/auth/me');
    return data;
  },
};


