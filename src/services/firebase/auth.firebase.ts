import {
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase.config';
import { UserRole } from '../../types/enums';

export interface AppUserProfile {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  centreId?: string;
  village?: string;
  district?: string;
  state?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const FirebaseAuthService = {
  /**
   * Listen to current user auth state.
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    if (!isFirebaseConfigured() || !auth) {
      callback(null);
      return () => {};
    }
    return firebaseOnAuthStateChanged(auth, callback);
  },

  /**
   * Get currently authenticated Firebase user
   */
  getCurrentUser(): FirebaseUser | null {
    if (!isFirebaseConfigured() || !auth) return null;
    return auth.currentUser;
  },

  /**
   * Sign in anonymously (useful for quick demo or guest farmer access)
   */
  async signInAnonymously(role: UserRole = UserRole.FARMER, displayName = 'Guest User'): Promise<AppUserProfile> {
    if (!isFirebaseConfigured() || !auth || !db) {
      return {
        uid: `guest_${Date.now()}`,
        name: displayName,
        phone: '9876543210',
        role,
      };
    }

    const credential = await firebaseSignInAnonymously(auth);
    const uid = credential.user.uid;

    await updateProfile(credential.user, { displayName });

    const userProfile: AppUserProfile = {
      uid,
      name: displayName,
      phone: '9876543210',
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', uid), userProfile, { merge: true });
    return userProfile;
  },

  /**
   * Quick login by phone & role (syncs or creates profile in Firestore)
   */
  async loginWithPhoneAndRole(phone: string, role: UserRole, name?: string): Promise<AppUserProfile> {
    if (!isFirebaseConfigured() || !auth || !db) {
      return {
        uid: `usr_${phone}`,
        name: name || (role === UserRole.FARMER ? 'Kisan Kumar' : 'Procurement Officer'),
        phone,
        role,
      };
    }

    // If already logged in, use current user or authenticate anonymously for mobile session
    let currentUser = auth.currentUser;
    if (!currentUser) {
      const cred = await firebaseSignInAnonymously(auth);
      currentUser = cred.user;
    }

    const uid = currentUser.uid;
    const resolvedName = name || (role === UserRole.FARMER ? 'Kisan Kumar' : 'Procurement Officer');

    await updateProfile(currentUser, { displayName: resolvedName });

    const userDocRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(userDocRef);

    let profile: AppUserProfile;
    if (existingSnap.exists()) {
      profile = existingSnap.data() as AppUserProfile;
      await updateDoc(userDocRef, {
        phone,
        role,
        updatedAt: serverTimestamp(),
      });
      profile.phone = phone;
      profile.role = role;
    } else {
      profile = {
        uid,
        name: resolvedName,
        phone,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userDocRef, profile);
    }

    return profile;
  },

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, pass: string): Promise<AppUserProfile | null> {
    if (!isFirebaseConfigured() || !auth || !db) return null;
    const cred = await firebaseSignInWithEmailAndPassword(auth, email, pass);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (snap.exists()) {
      return snap.data() as AppUserProfile;
    }
    return {
      uid: cred.user.uid,
      name: cred.user.displayName || email.split('@')[0],
      phone: '',
      email,
      role: UserRole.FARMER,
    };
  },

  /**
   * Register with email and password
   */
  async registerWithEmail(email: string, pass: string, name: string, role: UserRole, phone = ''): Promise<AppUserProfile | null> {
    if (!isFirebaseConfigured() || !auth || !db) return null;
    const cred = await firebaseCreateUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });

    const profile: AppUserProfile = {
      uid: cred.user.uid,
      name,
      phone,
      email,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), profile);
    return profile;
  },

  /**
   * Fetch user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<AppUserProfile | null> {
    if (!isFirebaseConfigured() || !db) return null;
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as AppUserProfile;
  },

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, updates: Partial<AppUserProfile>): Promise<void> {
    if (!isFirebaseConfigured() || !db) return;
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (isFirebaseConfigured() && auth) {
      await firebaseSignOut(auth);
    }
  },
};
