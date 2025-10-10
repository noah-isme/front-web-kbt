import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';
import UserFormDialog from '../components/users/UserFormDialog';
import UserTable from '../components/users/UserTable';
import { useUsers } from '../hooks/useUsers';
import { CreateUserInput, UpdateUserInput, User } from '../types';

const UsersPage = () => {
  const { users, usersQuery, createMutation, updateMutation, deleteMutation } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setConfirmDeleteUser(user);
  };

  const handleFormSubmit = (payload: CreateUserInput | UpdateUserInput, userId?: string) => {
    if (userId) {
      updateMutation.mutate({ id: userId, payload: payload as UpdateUserInput }, { onSuccess: closeForm });
    } else {
      createMutation.mutate(payload as CreateUserInput, { onSuccess: closeForm });
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const confirmDelete = () => {
    if (confirmDeleteUser) {
      deleteMutation.mutate(confirmDeleteUser.id, { onSuccess: () => setConfirmDeleteUser(null) });
    }
  };

  if (usersQuery.isLoading) {
    return <LoadingState message="Loading users..." />;
  }

  if (usersQuery.isError) {
    const message = usersQuery.error instanceof Error ? usersQuery.error.message : 'Failed to load users';
    return <ErrorState message={message} />;
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage operators and admins for the KBT system.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add User
        </Button>
      </Stack>

      {users.length === 0 ? (
        <EmptyState message="No users found. Create the first user to get started." />
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <UserFormDialog
        open={isFormOpen}
        onClose={closeForm}
        initialUser={selectedUser}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <Dialog open={Boolean(confirmDeleteUser)} onClose={() => setConfirmDeleteUser(null)}>
        <DialogTitle>Delete user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {confirmDeleteUser?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteUser(null)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
