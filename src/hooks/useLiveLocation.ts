import { useEffect, useState } from 'react';

import { LiveLocation } from '../types';
import useWebSocket from './useWebSocket';

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';

export const useLiveLocation = (eventId: string | null) => {
  const [liveLocations, setLiveLocations] = useState<LiveLocation[]>([]);
  const { data, isConnected } = useWebSocket(eventId ? `${WS_BASE_URL}/events/${eventId}/live/` : '');

  useEffect(() => {
    if (data && eventId) {
      // Assuming 'data' from WebSocket is an array of LiveLocation or a single LiveLocation
      // This logic might need adjustment based on actual WebSocket message format
      if (Array.isArray(data)) {
        setLiveLocations(data);
      } else {
        // If it's a single update, find and update or add it
        setLiveLocations((prevLocations) => {
          const existingIndex = prevLocations.findIndex((loc) => loc.id === data.id);
          if (existingIndex > -1) {
            const newLocations = [...prevLocations];
            newLocations[existingIndex] = data;
            return newLocations;
          }
          return [...prevLocations, data];
        });
      }
    }
  }, [data, eventId]);

  return { liveLocations, isConnected };
};
