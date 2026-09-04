import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'hi' | 'or';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'hi' | 'or') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  language: 'en',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language })
}));
