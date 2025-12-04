import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi, CreateEventData, UpdateEventData, FilterEventsParams } from '@/lib/api/events';
import { toast } from 'sonner';

export function useEvents(filters?: FilterEventsParams) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.getAll(filters),
    staleTime: 30000,
  });
}

export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => (id ? eventsApi.getById(id) : null),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      eventsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
}


