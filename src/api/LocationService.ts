import axios from 'axios';

const API_URL = 'http://localhost:9090'; // Ganti dengan URL API Anda

export const getLiveLocations = async (eventId: number) => {
    return axios.get(`${API_URL}/locations/live/${eventId}`);
};

export const updateLocation = async (location: { user_id: number; event_id: number; latitude: number; longitude: number }) => {
    return axios.post(`${API_URL}/location`, location);
};
