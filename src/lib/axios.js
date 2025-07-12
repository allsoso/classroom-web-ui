import axios from 'axios';
import { config } from './config';

export const api = axios.create({
  baseURL: '/api',
  timeout: config.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Erro na requisição:', error);
    
    if (error.response && error.response.status === 401) {
      const { logout } = await import('./auth.js');
      logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
); 