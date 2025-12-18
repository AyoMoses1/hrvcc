import { apiClient } from './axios';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactApi = {
  sendMessage: async (data: ContactFormData): Promise<ContactResponse> => {
    const response = await apiClient.post<ContactResponse>('/contact', data);
    return response.data;
  },
};

