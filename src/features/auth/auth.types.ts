export type Role = 'FARMER' | 'OPERATOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  mandiId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
