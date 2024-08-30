import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserService } from '../../api/UserService';
import { User } from '../../types/UserTypes';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const UserForm: React.FC = () => {
  const [user, setUser] = useState<User>({ID: 0, username: '', email: '', password: '', eventId: 0});
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadUser(parseInt(userId));
    }
  }, [userId]);

  const loadUser = async (userId: number) => {
    const fetchedUser = await UserService.getUserById(userId);
    setUser(fetchedUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      await UserService.updateUser(parseInt(userId), user);
    } else {
      await UserService.createUser(user);
    }
    navigate('/users');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
          {userId ? 'Edit User' : 'Create User'}
        </Typography>
        <TextField
          id="name"
          name="username"
          label="Name"
          variant="outlined"
          value={user.username}
          onChange={handleChange}
          required
        />
        <TextField
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          value={user.email}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          variant="outlined"
          type="password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          {userId ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Container>
  );
};

export default UserForm;
