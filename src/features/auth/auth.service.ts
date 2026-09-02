import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/endpoints';
import { User, Role } from './auth.types';
import { isFirebaseConfigured } from '../../services/firebase/firebase.config';
import { FirebaseAuthService } from '../../services/firebase/auth.firebase';
import { UserRole } from '../../types/enums';

export const AuthService = {
  async login(phoneNumber: string, role: Role): Promise<User> {
    if (isFirebaseConfigured()) {
      try {
        const enumRole = role as unknown as UserRole;
        const profile = await FirebaseAuthService.loginWithPhoneAndRole(phoneNumber, enumRole);
        return {
          id: profile.uid,
          name: profile.name,
          phoneNumber: profile.phone,
          role: role,
        };
      } catch (e) {
        console.warn('[AuthService] Firebase login error, fallback to local session:', e);
      }
    }

    // Mock user response
    await apiClient.post<User>(ENDPOINTS.AUTH_LOGIN, { phoneNumber, role });
    return {
      id: `usr_${Date.now()}`,
      name: role === 'FARMER' ? 'Kisan Kumar' : 'System User',
      phoneNumber,
      role,
    };
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured()) {
      await FirebaseAuthService.signOut();
    }
    await apiClient.post(ENDPOINTS.AUTH_LOGOUT);
  },
};
