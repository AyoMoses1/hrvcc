import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  memberPlansApi,
  CreateMemberPlanData,
  UpdateMemberPlanData,
  PaginationParams,
} from '@/lib/api/member-plans';
import { toast } from 'sonner';

export function useMemberPlans(params?: PaginationParams) {
  return useQuery({
    queryKey: ['member-plans', params],
    queryFn: () => memberPlansApi.getAll(params),
    staleTime: 30000,
  });
}

export function useMemberPlan(id: string | null) {
  return useQuery({
    queryKey: ['member-plans', id],
    queryFn: () => (id ? memberPlansApi.getById(id) : null),
    enabled: !!id,
  });
}

export function useCreateMemberPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberPlanData) =>
      memberPlansApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-plans'] });
      toast.success('Member plan created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create member plan');
    },
  });
}

export function useUpdateMemberPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberPlanData }) =>
      memberPlansApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-plans'] });
      toast.success('Member plan updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update member plan');
    },
  });
}

export function useDeleteMemberPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => memberPlansApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-plans'] });
      toast.success('Member plan deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete member plan');
    },
  });
}


