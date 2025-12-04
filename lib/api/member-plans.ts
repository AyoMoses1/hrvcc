import { apiClient } from './axios';
import { MemberPlan } from '@/lib/types';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface MemberPlansResponse {
  data: MemberPlan[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateMemberPlanData {
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

export interface UpdateMemberPlanData extends Partial<CreateMemberPlanData> {}

interface BackendMemberPlan {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  priceMonthly?: string;
  priceAnnual?: string;
  features: string[];
  isPopular?: boolean;
  sortOrder?: number;
}

interface BackendMemberPlansResponse {
  data: BackendMemberPlan[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

const transformMemberPlan = (backendPlan: BackendMemberPlan): MemberPlan => {
  return {
    id: backendPlan.id,
    category: backendPlan.tagline || backendPlan.slug,
    name: backendPlan.name,
    description: backendPlan.description || backendPlan.tagline,
    pricing: {
      monthly: backendPlan.priceMonthly ? parseFloat(backendPlan.priceMonthly) : undefined,
      yearly: backendPlan.priceAnnual ? parseFloat(backendPlan.priceAnnual) : undefined,
      oneTime: undefined,
    },
    features: backendPlan.features || [],
  };
};

export const memberPlansApi = {
  getAll: async (params?: PaginationParams): Promise<MemberPlansResponse> => {
    const { data } = await apiClient.get<BackendMemberPlansResponse>('/member-plans', {
      params,
    });
    return {
      data: (data.data || []).map(transformMemberPlan),
      meta: data.meta,
    };
  },

  getById: async (id: string): Promise<MemberPlan> => {
    const { data } = await apiClient.get<BackendMemberPlan>(`/member-plans/${id}`);
    return transformMemberPlan(data);
  },

  create: async (planData: CreateMemberPlanData): Promise<MemberPlan> => {
    const { data } = await apiClient.post<MemberPlan>('/member-plans', planData);
    return data;
  },

  update: async (id: string, planData: UpdateMemberPlanData): Promise<MemberPlan> => {
    const { data } = await apiClient.patch<MemberPlan>(`/member-plans/${id}`, planData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/member-plans/${id}`);
  },
};
