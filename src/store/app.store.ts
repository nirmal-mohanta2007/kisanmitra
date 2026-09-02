import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  language: 'en',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language })
}));
