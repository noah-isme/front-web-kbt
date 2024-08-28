import React, { useState, useEffect } from 'react';
import { User } from '../../types/UserTypes';
import { api } from '../../api/api';
import { 
  TextField, Typography, Box, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const fetchedUser = await api.getUsers().then(users => users.find(user => user.id === Number(id)));
      if (fetchedUser) {
        setUser(fetchedUser);
        setError(null);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!user) return;
    try {
      await api.updateUser(user.id, { username: user.username, email: user.email });
      setError(null);
      navigate('/users');
    } catch (err) {
      setError('Failed to update user');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Edit User</Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={user.username}
          onChange={e => setUser({ ...user, username: e.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/users')}>Cancel</Button>
          <Button variant="contained" onClick={updateUser}>Save</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUser;
