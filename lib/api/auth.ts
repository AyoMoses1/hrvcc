import { apiClient } from './axios';

/**
 * Basic signup data - minimal fields required for initial registration
 */
export interface BasicSignupData {
  email: string;
  password: string;
  name: string;
  category: 'Business' | 'Organization';
  planId?: string;
}

/**
 * Full registration data (legacy - for backward compatibility)
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  category: 'Business' | 'Organization';
  // Business Information
  businessName?: string;
  category2?: string;
  // Contact Person
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  position?: string;
  // Address
  officeAddress?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  phone?: string;
  secondaryPhone?: string;
  fax?: string;
  websiteUrl?: string;
  // Personal Details
  gender?: string;
  veteranOwnedBusiness?: boolean;
  branches?: string[];
  branchOfService?: string;
  referredBy?: string;
  other?: string;
  // Email & Password
  billingEmail?: string;
  username?: string;
  // Billing
  billingFirstName?: string;
  billingLastName?: string;
  billingCompany?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  // Payment
  creditCardNumber?: string;
  expirationMonth?: string;
  expirationYear?: string;
  cvmNumber?: string;
  // Plan
  planId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    category?: string;
    role: string;
    kycRequired?: boolean;
    kycStep?: string;
    kycStatus?: string;
    [key: string]: any;
  };
  token: string;
}

export const authApi = {
  /**
   * Basic signup - just email, password, name, and category
   * KYC steps are completed separately after signup
   */
  signup: async (data: BasicSignupData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response;
  },

  /**
   * Full registration (legacy - for backward compatibility)
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>('/auth/register', data);
    return response;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post<AuthResponse>('/auth/login', data);
    return response;
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const { data } = await apiClient.get<AuthResponse['user']>('/auth/me');
    return data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const { data: response } = await apiClient.post<{ message: string }>(
      '/auth/forgot-password',
      data
    );
    return response;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const { data: response } = await apiClient.post<{ message: string }>(
      '/auth/reset-password',
      data
    );
    return response;
  },
};
