import { create } from 'zustand';
import { AuthState, User, Role } from './auth.types';
import { AuthService } from './auth.service';
import { StorageService } from '../../services/storage/storage.service';

interface AuthStore extends AuthState {
  login: (phoneNumber: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  login: async (phoneNumber, role) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.login(phoneNumber, role);
      await StorageService.setItem('user', user);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
      await StorageService.removeItem('user');
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await StorageService.getItem<User>('user');
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  }
}));
