import { apiClient } from './axios';

/**
 * DTO for updating business profile
 */
export interface UpdateBusinessProfileDto {
  businessName?: string;
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
}

export interface UpdateContactPersonDto {
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  gender?: string;
}

export interface UpdateAddressDto {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  country?: string;
}

export interface UpdateBusinessDto {
  // User entity fields
  name?: string;
  title?: string;
  category?: 'Business' | 'Organization';
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

  // Related entity fields
  businessProfile?: UpdateBusinessProfileDto;
  contactPerson?: UpdateContactPersonDto;
  officeAddress?: UpdateAddressDto;
  billingAddress?: UpdateAddressDto;
}

export interface Business {
  id: string;
  businessName: string;
  category: 'Business' | 'Organization';
  category2?: string;
  description?: string;
  verified: boolean;
  suspended: boolean;
  email: string;
  phone?: string;
  secondaryPhone?: string;
  fax?: string;
  websiteUrl?: string;
  contactPerson?: {
    id: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    gender?: string;
    fullName: string;
    position?: string;
  };
  officeAddress?: {
    id: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    county?: string;
    country: string;
    fullAddress: string;
  };
  billingAddress?: {
    id: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  veteranOwnedBusiness: boolean;
  branchOfService?: string;
  branches?: string[];
  referredBy?: string;
  other?: string;
  image?: string;
  banner?: string;
  rating?: number;
  reviews: number;
  linkedin?: string;
  twitter?: string;
  title?: string;
  location?: string;
  country?: string;
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
  documents?: Array<{
    id: string;
    name: string;
    fileUrl: string;
    fileType?: string;
    documentType: string;
    createdAt: string;
  }>;
  subscription?: {
    id: string;
    status: string;
    planName?: string;
    startDate?: string;
    endDate?: string;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessesResponse {
  data: Business[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface BusinessFilters {
  page?: number;
  limit?: number;
  category?: 'Business' | 'Organization' | 'all';
  verified?: boolean;
  search?: string;
}

export const businessesApi = {
  getAll: async (filters?: BusinessFilters): Promise<BusinessesResponse> => {
    const params: Record<string, any> = {};
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.category && filters.category !== 'all') params.category = filters.category;
    if (filters?.verified !== undefined) params.verified = filters.verified;
    if (filters?.search) params.search = filters.search;

    const { data } = await apiClient.get<BusinessesResponse>('/businesses', { params });
    return data;
  },

  getById: async (id: string): Promise<Business> => {
    const { data } = await apiClient.get<Business>(`/businesses/${id}`);
    return data;
  },

  verify: async (id: string, verified: boolean): Promise<Business> => {
    const { data } = await apiClient.patch<Business>(`/businesses/${id}/verify`, { verified });
    return data;
  },

  suspend: async (id: string, suspended: boolean): Promise<Business> => {
    const { data } = await apiClient.patch<Business>(`/businesses/${id}/suspend`, { suspended });
    return data;
  },

  update: async (id: string, updateData: UpdateBusinessDto): Promise<Business> => {
    const { data } = await apiClient.patch<Business>(`/businesses/${id}`, updateData);
    return data;
  },
};
