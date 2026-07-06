import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // 👈 crucial – sends cookies
});

export default apiClient;

