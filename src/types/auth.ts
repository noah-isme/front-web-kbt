import { User } from './user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  issuedAt?: number; // Unix timestamp (seconds)
  expiresIn?: number; // Unix timestamp (seconds)
}
