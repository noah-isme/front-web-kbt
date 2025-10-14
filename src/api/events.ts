import { ApiResponse, CreateEventInput, Event, UpdateEventInput } from '../types';
import { apiClient } from './client';

export const fetchEvents = async (): Promise<ApiResponse<Event[]>> => {
  const { data } = await apiClient.get<ApiResponse<Event[]>>('/events');
  return data;
};

export const fetchEvent = async (id: string): Promise<ApiResponse<Event>> => {
  const { data } = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
  return data;
};

export const createEvent = async (payload: CreateEventInput): Promise<ApiResponse<Event>> => {
  const { data } = await apiClient.post<ApiResponse<Event>>('/events', payload);
  return data;
};

export const updateEvent = async (
  id: string,
  payload: UpdateEventInput,
): Promise<ApiResponse<Event>> => {
  const { data } = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, payload);
  return data;
};

export const deleteEvent = async (id: string): Promise<ApiResponse<{ id: string }>> => {
  const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/events/${id}`);
  return data;
};

export const uploadEventGpx = async (eventId: string, file: File): Promise<ApiResponse<Event>> => {
  const formData = new FormData();
  formData.append('gpx_file', file); // Assuming the backend expects 'gpx_file' as the field name

  const { data } = await apiClient.post<ApiResponse<Event>>(`/events/${eventId}/upload-gpx/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
