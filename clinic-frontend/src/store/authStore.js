// src/store/authStore.js
import { create } from 'zustand';
import { authService } from '../api/authService';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data, token: data.token, isAuthenticated: true });
  },

  register: async (email, password, fullName) => {
    const data = await authService.register(email, password, fullName);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data, token: data.token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  validateToken: async () => {
    if (!get().token) return;
    try {
      const data = await authService.validateToken(get().token);
      // Optionally update user info
      set({ user: data });
      localStorage.setItem('user', JSON.stringify(data));
    } catch {
      get().logout();
    }
  },
}));

export default useAuthStore;