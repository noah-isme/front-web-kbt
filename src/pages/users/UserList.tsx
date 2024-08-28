import React, { useState, useEffect } from 'react';
import { User } from '../../types/UserTypes';
import { api } from '../../api/api';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Typography, Box, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ username: '', email: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const user = await api.createUser(newUser);
      setUsers([...users, user]);
      setNewUser({ username: '', email: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!users.length) return <Typography>No users found</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>User List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">
                  <IconButton component={Link} to={`/users/edit/${user.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteUser(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>Add New User</Typography>
        <Box component="form" sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Name"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Button variant="contained" onClick={addUser}>Add User</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserList;