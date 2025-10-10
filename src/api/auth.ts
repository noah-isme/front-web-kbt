import { ApiResponse, AuthResponse, LoginPayload } from '../types';
import { apiClient } from './client';

export const loginRequest = async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  return data;
};
