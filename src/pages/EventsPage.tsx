import { useEffect, useState } from 'react';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';

import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';
import EventDetailCard from '../components/events/EventDetailCard';
import EventList from '../components/events/EventList';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';

const EventsPage = () => {
  const { events, eventsQuery } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events, selectedEvent]);

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
          Events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track ongoing and upcoming KBT events with real-time location monitoring.
        </Typography>
      </Stack>

      {events.length === 0 ? (
        <EmptyState message="No events available. Create an event from the backend to get started." />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} lg={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <EventList
                events={events}
                onSelect={(event) => setSelectedEvent(event)}
                selectedId={selectedEvent?.id}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <EventDetailCard event={selectedEvent} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default EventsPage;
