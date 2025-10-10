import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createUser, deleteUser, fetchUsers, updateUser } from '../api/users';
import { ApiResponse, CreateUserInput, UpdateUserInput, User } from '../types';

const USERS_QUERY_KEY = ['users'];

export const useUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<ApiResponse<User[]>>({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserInput) => createUser(payload),
    onSuccess: (response) => {
      toast.success(response.message ?? 'User created successfully');
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserInput }) => updateUser(id, payload),
    onSuccess: (response) => {
      toast.success(response.message ?? 'User updated successfully');
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (response) => {
      toast.success(response.message ?? 'User deleted successfully');
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(message);
    },
  });

  return {
    users: usersQuery.data?.data ?? [],
    usersQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
