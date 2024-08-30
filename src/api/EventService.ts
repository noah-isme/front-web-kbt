import axios from 'axios';
import { Event } from '../types/EventTypes';

const API_URL = 'http://localhost:9090';

export const EventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  },

  getEventById: async (ID: number): Promise<Event> => {
    const response = await axios.get(`${API_URL}/event/${ID}`);
    return response.data;
  },

  createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await axios.post(`${API_URL}/event/new`, event);
    return response.data;
  },

  updateEvent: async (id: number, event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await axios.put(`${API_URL}/event/${id}`, event);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/event/${id}`);
  },

  joinEvent: async (eventId: number, userId: number): Promise<void> => {
    await axios.post(`${API_URL}/event/${eventId}/join`, { userId });
  },

  leaveEvent: async (eventId: number, userId: number): Promise<void> => {
    await axios.post(`${API_URL}/event/${eventId}/leave`, { userId });
  },
};