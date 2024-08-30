import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../../types/EventTypes';
import { EventService } from '../../api/EventService';
import { TextField, Button, Container, Typography, Box } from '@mui/material';


const EventForm: React.FC = () => {
  const [event, setEvent] = useState<Event>({ID: 0, name: '', description: '', CreatedAt: new Date});
  const { eventId } = useParams<{ eventId: string }>();
  console.log(eventId)
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      loadEvent(parseInt(eventId));
    }
  }, [eventId]);

  const loadEvent = async (eventId: number) => {
    const fetchedEvent = await EventService.getEventById(eventId);
    setEvent(fetchedEvent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eventId) {
      await EventService.updateEvent(parseInt(eventId), event);
    } else {
      await EventService.createEvent(event);
    }
    navigate('/events');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 600,
          margin: 'auto',
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {eventId ? 'Edit Event' : 'Create Event'}
        </Typography>
        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          value={event.name}
          onChange={handleChange}
          required
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          variant="outlined"
          value={event.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          {eventId ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Container>
  );
};

export default EventForm;