import { useState } from 'react';

import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';
import LocationMap from '../components/locations/LocationMap';
import { useEvents } from '../hooks/useEvents';
import { useLiveLocation } from '../hooks/useLiveLocation';

const LiveLocationsPage = () => {
  const { events, eventsQuery } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { liveLocations, isConnected } = useLiveLocation(selectedEventId);

  if (eventsQuery.isLoading) {
    return <LoadingState message="Loading events..." />;
  }

  if (eventsQuery.isError) {
    const message = eventsQuery.error instanceof Error ? eventsQuery.error.message : 'Failed to load events';
    return <ErrorState message={message} />;
  }

  return (
    <Box>
      <Stack spacing={1} mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Live Locations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor real-time locations of participants during events. {isConnected ? '(Connected)' : '(Disconnected)'}
        </Typography>
      </Stack>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="event-select-label">Select Event</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEventId || ''}
          label="Select Event"
          onChange={(e) => setSelectedEventId(e.target.value as string)}
        >
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!selectedEventId ? (
        <EmptyState message="Please select an event to view live locations." />
      ) : !isConnected ? (
        <LoadingState message="Connecting to live location service..." />
      ) : liveLocations.length === 0 ? (
        <EmptyState message="No live locations available for this event yet." />
      ) : (
        <LocationMap locations={liveLocations} />
      )}
    </Box>
  );
};

export default LiveLocationsPage;

