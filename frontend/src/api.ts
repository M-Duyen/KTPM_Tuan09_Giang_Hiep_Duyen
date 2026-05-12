import axios from 'axios';

const ORCHESTRATOR_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: ORCHESTRATOR_URL,
});

export const login = (username: string, password: string) => api.post('/login', { username, password });
export const getTours = () => api.get('/tours');
export const getTourById = (id: string) => api.get(`/tours/${id}`);
export const bookTour = (userId: string, tourId: any) => api.post('/book-tour', { userId, tourId });

export default api;
