import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { Event } from '../../types/EventTypes';
import { EventService } from '../../api/EventService';
import { useParams } from 'react-router-dom';

// Props yang diterima oleh komponen EventDetails
// interface EventDetailsProps {
//   eventId: number;
// }

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { eventId } = useParams()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await EventService.getEventById(eventId ? parseInt(eventId) : 0 );
        setEvent(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6">Event not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>{event.name}</Typography>
        <Typography variant="body1" paragraph>{event.description}</Typography>
        <Typography variant="subtitle2">Created At: {new Date(event.CreatedAt).toLocaleString()}</Typography>
        
        {event.users && event.users.length > 0 && (
          <>
            <Typography variant="h6" style={{ marginTop: '20px' }}>Participants:</Typography>
            <List>
              {event.users.map((user) => (
                <ListItem key={user.ID}>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default EventDetails;