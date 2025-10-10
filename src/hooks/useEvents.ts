import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createEvent, deleteEvent, fetchEvent, fetchEvents, updateEvent } from '../api/events';
import { ApiResponse, CreateEventInput, Event, UpdateEventInput } from '../types';

const EVENTS_QUERY_KEY = ['events'];

export const useEvents = () => {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery<ApiResponse<Event[]>>({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateEventInput) => createEvent(payload),
    onSuccess: (response) => {
      toast.success(response.message ?? 'Event created successfully');
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create event';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventInput }) => updateEvent(id, payload),
    onSuccess: (response) => {
      toast.success(response.message ?? 'Event updated successfully');
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update event';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: (response) => {
      toast.success(response.message ?? 'Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete event';
      toast.error(message);
    },
  });

  const getEventQuery = (id: string) =>
    queryClient.fetchQuery<ApiResponse<Event>>({
      queryKey: [...EVENTS_QUERY_KEY, id],
      queryFn: () => fetchEvent(id),
    });

  return {
    events: eventsQuery.data?.data ?? [],
    eventsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    getEventQuery,
  };
};
