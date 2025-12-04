import { useQuery } from '@tanstack/react-query';
import { usersApi, PaginationParams } from '@/lib/api/users';

export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params),
    staleTime: 30000,
  });
}

export function useUser(id: string | null) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => (id ? usersApi.getById(id) : null),
    enabled: !!id,
  });
}


