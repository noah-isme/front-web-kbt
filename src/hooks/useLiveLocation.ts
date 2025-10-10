import { useQuery } from '@tanstack/react-query';

import { fetchLiveLocations } from '../api/locations';
import { ApiResponse, LiveLocation } from '../types';

export const useLiveLocation = (eventId: string | null, enabled = true) => {
  return useQuery<ApiResponse<LiveLocation[]>>({
    queryKey: ['live-location', eventId],
    queryFn: () => {
      if (!eventId) {
        throw new Error('Event ID is required');
      }
      return fetchLiveLocations(eventId);
    },
    enabled: Boolean(eventId) && enabled,
    refetchInterval: 5000,
  });
};
