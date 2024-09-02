import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventService } from '../../api/EventService';
import { Event } from '../../types/EventTypes';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const EventForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const { eventId } = useParams<{ eventId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (eventId) {
  //     loadEvent(parseInt(eventId));
  //   }
  // }, [eventId]);

  // const loadEvent = async (eventId: number) => {
  //   const fetchedEvent = await EventService.getEventById(eventId);
  //   setEvent(fetchedEvent);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (eventId) {
        await EventService.updateEvent(eventId, { name, description, gpx_route: gpxFile || undefined });
      } else {
        await EventService.createEvent({ name, description, gpx_route: gpxFile || undefined });
      } 
    } catch (err) {
      setError('Gagal menyimpan event.');
    } finally {
      setIsLoading(false);
    }
    navigate('/events');
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setEvent({ ...event, [e.target.name]: e.target.value });
  // };

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
        />
        <Button
          component="label"
          variant="contained"
          color="primary"
          sx={{ alignSelf: 'flex-start' }}
        >
          Upload GPX File
          <input
            type="file"
            accept=".gpx"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setGpxFile(e.target.files[0]);
              }
            }}
          />
        </Button>        
        <Button
          type="submit"
          disabled={isLoading}
          variant="contained"
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Event'}
        </Button>
        {error && <p>{error}</p>}
      </Box>
    </Container>
  );
};

export default EventForm;
