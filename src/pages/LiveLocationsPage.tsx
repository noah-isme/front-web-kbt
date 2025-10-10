import { useEffect, useState } from 'react';

import MapIcon from '@mui/icons-material/Map';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';
import LocationMap from '../components/locations/LocationMap';
import { useEvents } from '../hooks/useEvents';
import { useLiveLocation } from '../hooks/useLiveLocation';

const LiveLocationsPage = () => {
  const { events, eventsQuery } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const liveLocationQuery = useLiveLocation(selectedEventId || null, Boolean(selectedEventId));

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const handleRefresh = () => {
    if (selectedEventId) {
      liveLocationQuery.refetch();
    }
  };

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
          Live Location
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor live participant locations for the selected event. Data refreshes automatically every 5 seconds.
        </Typography>
      </Stack>

      {events.length === 0 ? (
        <EmptyState message="No events available. Locations require an active event." />
      ) : (
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              select
              label="Event"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              sx={{ minWidth: 240 }}
            >
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.title}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={!selectedEventId || liveLocationQuery.isFetching}
            >
              Refresh now
            </Button>
          </Stack>

          {liveLocationQuery.isLoading ? (
            <LoadingState message="Loading live locations..." />
          ) : liveLocationQuery.isError ? (
            <ErrorState
              title="Unable to load locations"
              message={
                liveLocationQuery.error instanceof Error
                  ? liveLocationQuery.error.message
                  : 'Unknown error while fetching live locations'
              }
            />
          ) : (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <MapIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Active locations
                </Typography>
                {liveLocationQuery.isFetching && (
                  <Typography variant="caption" color="text.secondary">
                    Updating...
                  </Typography>
                )}
              </Stack>
              <LocationMap locations={liveLocationQuery.data?.data ?? []} />
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default LiveLocationsPage;
