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

  // createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
  //   const response = await axios.post(`${API_URL}/event/new`, event);
  //   return response.data;
  // },

  createEvent: async (eventData: Event) => {
    // Validasi nama sebelum membuat permintaan
  if (!eventData.name.trim()) {
    throw new Error('Nama event tidak boleh kosong.');
  }
    const formData = new FormData();
    formData.append('name', eventData.name);
    formData.append('description', eventData.description);
    if (eventData.gpx_route) {
      formData.append('gpxFile', eventData.gpx_route);
    }
  
    try {
      const response = await axios.post(`${API_URL}/event/new`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // updateEvent: async (id: number, event: Omit<Event, 'id'>): Promise<Event> => {
  //   const response = await axios.put(`${API_URL}/event/${id}`, event);
  //   return response.data;
  // },

  updateEvent: async (eventId: string, eventData: Event) => {
    const formData = new FormData();
    formData.append('name', eventData.name);
    formData.append('description', eventData.description);
    if (eventData.gpx_route) {
      formData.append('gpxFile', eventData.gpx_route);
    }
  
    try {
      const response = await axios.put(`${API_URL}/${eventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // createEvent: async (formData: FormData): Promise<Event> => {

  //   const response = await axios.post(`${API_URL}/event/new`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });

  //   return response.data;
  // },
  
  // updateEvent: async (id: number, formData: FormData): Promise<Event> => {
  //   // Buat FormData dan tambahkan data event ke FormData
    

  //   // Kirimkan data melalui axios
  //   const response = await axios.put(`${API_URL}/event/${id}`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });
  //   console.log(response.data)

  //   return response.data;
  // },

  deleteEvent: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/event/${id}`);
  },

  joinEvent: async (eventId: number, userId: number): Promise<void> => {
    await axios.post(`${API_URL}/event/${eventId}/join/${userId}`);
  },

  leaveEvent: async (eventId: number, userId: number): Promise<void> => {
    await axios.post(`${API_URL}/event/${eventId}/leave`, { userId });
  },
};