import { apiClient } from './axios';
import { Event } from '@/lib/types';

export interface FilterEventsParams {
  category?: string;
  search?: string;
  from?: string;
  to?: string;
  upcomingOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface EventsResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export const eventsApi = {
  getAll: async (params?: FilterEventsParams): Promise<EventsResponse> => {
    const { data } = await apiClient.get<EventsResponse>('/events', { params });
    return {
      data: (data.data || []).map((event) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
      })),
      meta: data.meta || {
        total: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
      },
    };
  },

  getById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<Event>(`/events/${id}`);
    return {
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
    };
  },

  create: async (eventData: CreateEventData): Promise<Event> => {
    const { data } = await apiClient.post<Event>('/events', eventData);
    return {
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
    };
  },

  update: async (id: string, eventData: UpdateEventData): Promise<Event> => {
    const { data } = await apiClient.patch<Event>(`/events/${id}`, eventData);
    return {
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
    };
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },
};

