import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Snackbar,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';

import { Event } from '../../types/EventTypes';
import { User } from '../../types/UserTypes';
import { EventService } from '../../api/EventService';
import { UserService } from '../../api/UserService';
import { useParams } from 'react-router-dom';

// Props yang diterima oleh komponen EventDetails
// interface EventDetailsProps {
//   eventId: number;
// }

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState<boolean>(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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

  const handleOpenUserDialog = async () => {
    try {
      const response = await UserService.getUsers();
      setAvailableUsers(response);
      setOpenUserDialog(true);
    } catch (err) {
      setJoinError('Failed to fetch available users');
    }
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setSelectedUsers([]);
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleJoinEvent = async () => {
    try {
      await Promise.all(selectedUsers.map(userId => 
        EventService.joinEvent(eventId ? parseInt(eventId) : 0, userId)
      ));
      setJoinSuccess(true);
      // Refresh event data to show updated participants list
      const response = await EventService.getEventById(eventId ? parseInt(eventId) : 0);
      setEvent(response);
      handleCloseUserDialog();
    } catch (err) {
      setJoinError('Failed to join the event');
    }
  };

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

        <Button 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '20px' }}
          onClick={handleOpenUserDialog} // Assuming user ID 1 for demonstration
        >
          Add Participants
        </Button>
      </Paper>

      <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
        <DialogTitle>Select Users to Add</DialogTitle>
        <DialogContent>
          <List>
            {availableUsers.map((user) => (
              <ListItem key={user.ID}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedUsers.includes(user.ID ? user.ID : 0)}
                      onChange={() => handleUserSelect(user.ID? user.ID :0)}
                    />
                  }
                  label={user.username}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancel</Button>
          <Button onClick={handleJoinEvent} color="primary">
            Add Selected Users
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={joinSuccess}
        autoHideDuration={6000}
        onClose={() => setJoinSuccess(false)}
        message="Successfully joined the event!"
      />

      <Snackbar
        open={!!joinError}
        autoHideDuration={6000}
        onClose={() => setJoinError(null)}
        message={joinError}
      />
    </Container>
  );
};

export default EventDetails;