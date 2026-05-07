import axios from 'axios';

// All requests go through the API Gateway on port 8080
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* ignore */ }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch { /* ignore */ }
    }
    return Promise.reject(error);
  }
);

export default api;
