import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  Firestore,
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Checks whether Firebase configuration credentials are provided and valid.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your_project_id' &&
    firebaseConfig.appId &&
    firebaseConfig.appId !== 'your_app_id'
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    try {
      if (Platform.OS === 'web') {
        auth = initializeAuth(app, {
          persistence: browserLocalPersistence,
        });
      } else {
        // In React Native / mobile environment
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const authModule = require('firebase/auth');
        const getReactNativePersistence = authModule.getReactNativePersistence;
        auth = initializeAuth(app, {
          persistence: typeof getReactNativePersistence === 'function' ? getReactNativePersistence(AsyncStorage) : undefined,
        });
      }
    } catch {
      // If auth is already initialized in fast-refresh, retrieve existing instance
      auth = getAuth(app);
    }

    try {
      // Suppress noisy internal RPC transport retry warnings
      setLogLevel('error');
    } catch {
      // ignore
    }

    try {
      // Use initializeFirestore with experimentalForceLongPolling to resolve
      // WebChannelConnection RPC 'Listen' stream transport errors in React Native/Expo
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
    } catch {
      db = getFirestore(app);
    }
    storage = getStorage(app);
    console.log('[Firebase] Initialized successfully for project:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('[Firebase] Initialization error:', error);
  }
} else {
  console.info('[Firebase] Config keys not detected or using defaults. Running in local/demo mode.');
}

export { app, auth, db, storage };

export function getFirebaseDb(): Firestore {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please check your .env configuration.');
  }
  return db;
}

export function getFirebaseAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your .env configuration.');
  }
  return auth;
}
