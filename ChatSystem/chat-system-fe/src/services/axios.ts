import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // 👈 crucial – sends cookies
});

apiClient.interceptors.response.use(
  (response) => response,   // pass through successful responses
  (error) => {
    // If the server responds with 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear any stored user state (e.g., React context, localStorage)
      // Example: localStorage.removeItem('user');
      // If you use a global state like Zustand/Redux, dispatch a logout action.

      // Redirect to login page
      // Using window.location.href (full page reload) ensures fresh state.
      // Or use React Router's navigate if you have access to the history object.
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

