import { ApiResponse, LiveLocation } from '../types';
import { apiClient } from './client';

export const fetchLiveLocations = async (eventId: string): Promise<ApiResponse<LiveLocation[]>> => {
  const { data } = await apiClient.get<ApiResponse<LiveLocation[]>>('/locations', {
    params: { eventId },
  });
  return data;
};
