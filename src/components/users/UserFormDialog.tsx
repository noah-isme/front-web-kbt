import { ChangeEvent, useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { CreateUserInput, UpdateUserInput, User, UserRole } from '../../types';

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserInput | UpdateUserInput, userId?: string) => void;
  initialUser?: User | null;
  isSubmitting: boolean;
}

const roles: UserRole[] = ['admin', 'operator', 'viewer'];

const emptyForm: CreateUserInput = {
  name: '',
  email: '',
  phone: '',
  role: 'viewer',
  password: '',
};

const UserFormDialog = ({ open, onClose, onSubmit, initialUser, isSubmitting }: UserFormDialogProps) => {
  const [form, setForm] = useState<CreateUserInput>(emptyForm);

  useEffect(() => {
    if (initialUser) {
      setForm({
        name: initialUser.name,
        email: initialUser.email,
        phone: initialUser.phone ?? '',
        role: initialUser.role,
        password: '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialUser]);

  const handleChange = (field: keyof CreateUserInput) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = () => {
    if (initialUser) {
      const payload: UpdateUserInput = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: form.password || undefined,
      };
      onSubmit(payload, initialUser.id);
    } else {
      onSubmit(form);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialUser ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth required />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            fullWidth
            required
          />
          <TextField label="Phone" value={form.phone} onChange={handleChange('phone')} fullWidth />
          <TextField select label="Role" value={form.role} onChange={handleChange('role')} fullWidth>
            {roles.map((role) => (
              <MenuItem key={role} value={role} sx={{ textTransform: 'capitalize' }}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            fullWidth
            required={!initialUser}
            helperText={initialUser ? 'Fill to reset password' : undefined}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {initialUser ? 'Save changes' : 'Create user'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
