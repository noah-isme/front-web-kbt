import axios from 'axios';
import { User } from '../types/UserTypes';

const API_URL = 'http://localhost:9090';

export const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  },

  updateUser: async (id: number, user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  },
};
