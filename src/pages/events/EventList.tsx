import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button, Container, Typography } from '@mui/material';
import { Event } from '../../types/EventTypes';
import { EventService } from '../../api/EventService';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const fetchedEvents = await EventService.getEvents();
    setEvents(fetchedEvents);
  };

  const handleDelete = async (id: number) => {
    await EventService.deleteEvent(id);
    loadEvents();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Events</Typography>
      <Button component={RouterLink} to="/event/new" variant="contained" color="primary">Create New Event</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.ID}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{new Date(event.CreatedAt).toLocaleDateString()}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{event.users?.length || 0}</TableCell>
                <TableCell>
                  <Button component={RouterLink} to={`/event/${event.ID}`} variant="contained" color="primary">View</Button>
                  <Button component={RouterLink} to={`/event/${event.ID}/edit`} variant="contained" color="secondary">Edit</Button>
                  <Button onClick={() => handleDelete(event.ID!)} variant="contained" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EventList;