import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,           
  isAuthenticated: false,
  isLoading: true,      

  isAdmin: () => get().user?.role === 'admin',
  isVendor: () => get().user?.role === 'vendor',
  isCustomer: () => {
    const role = get().user?.role;
    return role === 'customer' || (get().isAuthenticated && !role);
  },

  login: async (email, password) => {
    await authService.login(email, password);
    const profile = await authService.getUserProfile();
    set({ user: profile, isAuthenticated: true, isLoading: false });
  },

  register: async (userData) => {
    await authService.register(userData);
    const profile = await authService.getUserProfile();
    set({ user: profile, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  updateUser: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),

  initAuthListener: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const profile = await authService.getUserProfile();
        if (profile && !profile.isBanned) {
          set({ user: profile, isAuthenticated: true, isLoading: false });
          return;
        }
      }
    } catch (e) {
      console.warn('Auth check failed', e);
    }
    
    // Clear token if invalid/banned
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
