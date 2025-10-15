import { useEffect, useState } from 'react';

import { LiveLocation } from '../types';
import useWebSocket, { WebSocketStatus } from './useWebSocket';

const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';

export const useLiveLocation = (eventId: string | null) => {
  const [liveLocations, setLiveLocations] = useState<LiveLocation[]>([]);
  const { data, status } = useWebSocket(eventId ? `${WS_BASE_URL}/events/${eventId}/live/` : '');

  useEffect(() => {
    setLiveLocations([]);
  }, [eventId]);

  useEffect(() => {
    if (!eventId || !data) {
      return;
    }

    if (Array.isArray(data)) {
      setLiveLocations(data);
      return;
    }

    if (typeof data !== 'object' || data === null || !('id' in data)) {
      return;
    }

    const locationUpdate = data as LiveLocation;
    setLiveLocations((prevLocations) => {
      const existingIndex = prevLocations.findIndex((loc) => loc.id === locationUpdate.id);
      if (existingIndex > -1) {
        const newLocations = [...prevLocations];
        newLocations[existingIndex] = { ...newLocations[existingIndex], ...locationUpdate };
        return newLocations;
      }
      return [...prevLocations, locationUpdate];
    });
  }, [data, eventId]);

  const connectionStatus: WebSocketStatus | 'idle' = eventId ? status : 'idle';

  return {
    liveLocations,
    status: connectionStatus,
    isConnected: connectionStatus === 'open',
  };
};
