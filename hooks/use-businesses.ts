import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessesApi, BusinessFilters, UpdateBusinessDto } from '@/lib/api/businesses';
import { toast } from 'sonner';

export function useBusinesses(filters?: BusinessFilters) {
  return useQuery({
    queryKey: ['businesses', filters],
    queryFn: () => businessesApi.getAll(filters),
    staleTime: 30000,
  });
}

export function useBusiness(id: string | null) {
  return useQuery({
    queryKey: ['businesses', id],
    queryFn: () => (id ? businessesApi.getById(id) : null),
    enabled: !!id,
  });
}

export function useVerifyBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      businessesApi.verify(id, verified),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success(
        data.verified ? 'Business verified successfully' : 'Business verification revoked'
      );
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update verification status');
    },
  });
}

export function useSuspendBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) =>
      businessesApi.suspend(id, suspended),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success(data.suspended ? 'Business suspended' : 'Business unsuspended');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update suspension status');
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBusinessDto }) =>
      businessesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}
