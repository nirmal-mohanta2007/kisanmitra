/**
 * authService.ts
 *
 * Role-aware authentication service for Kisan Mitra.
 * - Real Firebase mode: signs in with email/password, reads users/{uid} from Firestore, verifies role.
 * - Demo mode (when Firebase is not configured): uses mock credentials, no real network calls.
 * - Persists session to AsyncStorage so app restart restores auth state.
 */

import { FirebaseAuthService, AppUserProfile } from './firebase/auth.firebase';
import { isFirebaseConfigured } from './firebase/firebase.config';
import { UserRole } from '../types/enums';
import { StorageService } from './storage/storage.service';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AuthRole = 'farmer' | 'operator' | 'admin';

export class AuthError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Firebase error → friendly message
// ─────────────────────────────────────────────────────────────────────────────

export function translateFirebaseError(code: string, role?: string): string {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect password. Please check your credentials and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check the email or register.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact the administrator.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/operation-not-allowed':
      return 'This login method is not enabled. Contact administrator.';
    case 'ACCESS_DENIED':
      if (role === 'farmer') return 'Access denied. This account is not registered as a Farmer.';
      if (role === 'operator') return 'Access denied. This account is not registered as an Operator.';
      if (role === 'admin') return 'Access denied. This account is not registered as a Government Admin.';
      return 'Access denied. This account does not have the required role.';
    case 'MISSING_ROLE':
      return 'Your account role is not configured. Please contact the system administrator.';
    case 'ACCOUNT_DISABLED':
      return 'This account has been disabled. Contact the system administrator.';
    default:
      return 'Login failed. Please check your credentials and try again.';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo-mode mock profiles (used only when Firebase is NOT configured)
// ─────────────────────────────────────────────────────────────────────────────

interface DemoProfile extends AppUserProfile {
  _demoPassword: string;
}

export const DEMO_CREDENTIALS: Record<AuthRole, { email: string; password: string }> = {
  farmer:   { email: 'farmer@kisanmitra.demo',   password: 'demo1234' },
  operator: { email: 'operator@kisanmitra.demo', password: 'demo1234' },
  admin:    { email: 'admin@kisanmitra.demo',    password: 'demo1234' },
};

const DEMO_PROFILES: DemoProfile[] = [
  {
    uid: 'demo-farmer-uid',
    name: 'Ramesh Kumar (Demo Farmer)',
    phone: '9876543210',
    email: 'farmer@kisanmitra.demo',
    role: UserRole.FARMER,
    _demoPassword: 'demo1234',
  },
  {
    uid: 'demo-operator-uid',
    name: 'Anil Kumar (Demo Operator)',
    phone: '9998887770',
    email: 'operator@kisanmitra.demo',
    role: UserRole.OPERATOR,
    centreId: 'C-001',
    _demoPassword: 'demo1234',
  },
  {
    uid: 'demo-admin-uid',
    name: 'District Collector Singh (Demo Admin)',
    phone: '9998887773',
    email: 'admin@kisanmitra.demo',
    role: UserRole.ADMIN,
    _demoPassword: 'demo1234',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function authRoleToUserRole(authRole: AuthRole): UserRole {
  switch (authRole) {
    case 'farmer':   return UserRole.FARMER;
    case 'operator': return UserRole.OPERATOR;
    case 'admin':    return UserRole.ADMIN;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sign in with email + password and verify the selected role against Firestore.
 *
 * Throws AuthError on:
 *   - Wrong credentials
 *   - User not found
 *   - Role mismatch (ACCESS_DENIED)
 *   - Disabled account
 *   - Network issues
 */
export async function signInWithRole(
  email: string,
  password: string,
  selectedRole: AuthRole,
): Promise<AppUserProfile> {
  const trimmedEmail = email.trim().toLowerCase();
  const expectedRole = authRoleToUserRole(selectedRole);

  // ── DEMO MODE ────────────────────────────────────────────────────────────
  if (!isFirebaseConfigured()) {
    const profile = DEMO_PROFILES.find((p) => p.email === trimmedEmail);

    if (!profile) {
      throw new AuthError('auth/user-not-found', translateFirebaseError('auth/user-not-found'));
    }
    if (password !== profile._demoPassword) {
      throw new AuthError('auth/wrong-password', translateFirebaseError('auth/wrong-password'));
    }
    if (profile.role !== expectedRole) {
      throw new AuthError('ACCESS_DENIED', translateFirebaseError('ACCESS_DENIED', selectedRole));
    }

    const { _demoPassword: _removed, ...cleanProfile } = profile;
    await StorageService.setItem('kisan_current_role', cleanProfile.role);
    await StorageService.setItem('kisan_auth_user', cleanProfile);
    return cleanProfile;
  }

  // ── FIREBASE MODE ────────────────────────────────────────────────────────
  let profile: AppUserProfile | null = null;
  try {
    profile = await FirebaseAuthService.signInWithEmail(trimmedEmail, password);
  } catch (err: any) {
    const code: string = err?.code || 'auth/unknown';
    throw new AuthError(code, translateFirebaseError(code));
  }

  if (!profile) {
    throw new AuthError('auth/user-not-found', translateFirebaseError('auth/user-not-found'));
  }

  if (!profile.role) {
    await FirebaseAuthService.signOut();
    throw new AuthError('MISSING_ROLE', translateFirebaseError('MISSING_ROLE'));
  }

  if (profile.role !== expectedRole) {
    await FirebaseAuthService.signOut();
    throw new AuthError('ACCESS_DENIED', translateFirebaseError('ACCESS_DENIED', selectedRole));
  }

  await StorageService.setItem('kisan_current_role', profile.role);
  await StorageService.setItem('kisan_auth_user', profile);
  return profile;
}

/**
 * Sign out and clear persisted session.
 */
export async function signOut(): Promise<void> {
  try {
    await FirebaseAuthService.signOut();
  } catch {
    // ignore Firebase errors on signout
  }
  await StorageService.removeItem('kisan_current_role');
  await StorageService.removeItem('kisan_auth_user');
}

/**
 * Restore a persisted session from AsyncStorage (used on app startup).
 * Returns null if no valid session found.
 */
export async function getPersistedSession(): Promise<AppUserProfile | null> {
  try {
    const user = await StorageService.getItem<AppUserProfile>('kisan_auth_user');
    if (!user || !user.uid || !user.role) return null;
    return user;
  } catch {
    return null;
  }
}
