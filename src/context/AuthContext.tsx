/**
 * AuthContext.tsx
 *
 * Centralized Firebase Authentication context for Kisan Mitra.
 * Must be placed INSIDE AppProvider so it can dispatch SET_ROLE to AppContext.
 *
 * Usage:
 *   const { isAuthenticated, role, authLoading, signIn, signOut } = useAuthContext();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { FirebaseAuthService, type AppUserProfile } from '../services/firebase/auth.firebase';
import {
  signInWithRole,
  signOut as authSignOut,
  getPersistedSession,
  type AuthRole,
} from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase/firebase.config';
import { UserRole } from '../types/enums';
import { useAppContext } from '../store/app-context';

// ─────────────────────────────────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Raw Firebase Auth user (null when not logged in or Firebase not configured) */
  firebaseUser: FirebaseUser | null;
  /** Full Kisan Mitra user profile from Firestore / demo */
  appUser: AppUserProfile | null;
  /** The user's role or null if not authenticated */
  role: UserRole | null;
  /** True while initial session check is in progress */
  authLoading: boolean;
  /** Convenience: true when appUser is not null */
  isAuthenticated: boolean;
  /**
   * Sign in with email + password for a specific role.
   * Throws AuthError if credentials are wrong or role doesn't match.
   */
  signIn: (email: string, password: string, selectedRole: AuthRole) => Promise<AppUserProfile>;
  /** Sign out and clear session */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const { dispatch } = useAppContext();

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Helper: sync profile into React state + AppContext
  const applyProfile = useCallback(
    (profile: AppUserProfile) => {
      setAppUser(profile);
      dispatch({
        type: 'SET_ROLE',
        payload: {
          role: profile.role,
          userId: profile.uid,
          userName: profile.name,
        },
      });
    },
    [dispatch],
  );

  // ── Firebase mode: listen to auth state ──────────────────────────────────
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // Firebase not configured — fall through to demo/local session below
      return;
    }

    const unsubscribe = FirebaseAuthService.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);

      if (user) {
        // Try loading user profile from Firestore
        try {
          const profile = await FirebaseAuthService.getUserProfile(user.uid);
          if (profile) {
            applyProfile(profile);
          } else {
            // Profile doc missing — treat as unauthenticated
            setAppUser(null);
          }
        } catch {
          setAppUser(null);
        }
      } else {
        // Firebase signed out — check for demo/local session
        const persisted = await getPersistedSession();
        if (persisted) {
          applyProfile(persisted);
        } else {
          setAppUser(null);
        }
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, [applyProfile]);

  // ── Demo mode: restore session from AsyncStorage on mount ────────────────
  useEffect(() => {
    if (isFirebaseConfigured()) return; // handled by onAuthStateChanged above

    getPersistedSession()
      .then((persisted) => {
        if (persisted) {
          applyProfile(persisted);
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, [applyProfile]);

  // ─────────────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────────────

  const signIn = useCallback(
    async (email: string, password: string, selectedRole: AuthRole): Promise<AppUserProfile> => {
      const profile = await signInWithRole(email, password, selectedRole);
      applyProfile(profile);
      return profile;
    },
    [applyProfile],
  );

  const signOut = useCallback(async () => {
    await authSignOut();
    setFirebaseUser(null);
    setAppUser(null);
    // Reset AppContext role to a safe default
    dispatch({
      type: 'SET_ROLE',
      payload: { role: UserRole.FARMER, userId: '', userName: '' },
    });
  }, [dispatch]);

  // ─────────────────────────────────────────────────────────────────────────
  // Context value
  // ─────────────────────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    firebaseUser,
    appUser,
    role: appUser?.role ?? null,
    authLoading,
    isAuthenticated: appUser !== null,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider (inside AppProvider)');
  }
  return context;
}
