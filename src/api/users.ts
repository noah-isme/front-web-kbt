import { ApiResponse, CreateUserInput, UpdateUserInput, User } from '../types';
import { apiClient } from './client';

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const { data } = await apiClient.get<ApiResponse<User[]>>('/users');
  return data;
};

export const fetchUser = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
  return data;
};

export const createUser = async (payload: CreateUserInput): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.post<ApiResponse<User>>('/users', payload);
  return data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserInput,
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<{ id: string }>> => {
  const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/users/${id}`);
  return data;
};
