export type UserRole = 'FARMER' | 'OPERATOR' | 'ADMIN';
export type Role = UserRole;

export interface User {
  id: string;
  phoneNumber?: string;
  phone?: string;
  role: UserRole;
  name: string;
  status?: string;
  mandiId?: string;
  centreId?: string;
  jurisdiction?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
