// src/config/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

/**
 * Firebase Configuration Interface
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Firebase Services Interface
 */
export interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage | null;
}

/**
 * Firebase Configuration Object
 * These values should be set in environment variables
 */
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate Firebase Configuration
 */
function validateFirebaseConfig(config: FirebaseConfig): void {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(
      `Missing Firebase configuration fields: ${missingFields.join(', ')}\n` +
      'Please check your .env file and ensure all required environment variables are set.'
    );
  }
}

/**
 * Initialize Firebase App
 */
function initializeFirebaseApp(): FirebaseApp {
  try {
    // Validate configuration before initialization
    validateFirebaseConfig(firebaseConfig);

    // Check if Firebase app is already initialized
    if (getApps().length > 0) {
      console.log('✅ Firebase app already initialized');
      return getApps()[0];
    }

    // Initialize Firebase app
    const app = initializeApp(firebaseConfig);
    console.log('🔥 Firebase app initialized successfully');
    
    return app;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
}

/**
 * Initialize Firebase Services
 */
function initializeFirebaseServices(app: FirebaseApp): FirebaseServices {
  try {
    // Initialize Firestore
    const db = getFirestore(app);
    
    // Initialize Auth
    const auth = getAuth(app);
    
    // Initialize Storage (اختیاری - فقط اگر Blaze Plan داشته باشید)
    let storage = null;
    try {
      if (process.env.REACT_APP_ENABLE_STORAGE === 'true') {
        storage = getStorage(app);
      }
    } catch (error) {
      console.warn('⚠️  Storage not available - continuing without file upload');
    }

    // Connect to emulators in development mode
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
      console.log('🔧 Connecting to Firebase emulators...');
      
      // Connect Firestore emulator
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('📊 Connected to Firestore emulator');
      } catch (error) {
        console.warn('⚠️  Firestore emulator connection failed:', error);
      }

      // Connect Auth emulator
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        console.log('🔐 Connected to Auth emulator');
      } catch (error) {
        console.warn('⚠️  Auth emulator connection failed:', error);
      }

      // Connect Storage emulator (اختیاری)
      if (storage) {
        try {
          connectStorageEmulator(storage, 'localhost', 9199);
          console.log('📁 Connected to Storage emulator');
        } catch (error) {
          console.warn('⚠️  Storage emulator connection failed:', error);
        }
      }
    }

    console.log('✅ All Firebase services initialized');
    
    return { app, db, auth, storage };
  } catch (error) {
    console.error('❌ Firebase services initialization failed:', error);
    throw error;
  }
}

/**
 * Firebase Services Instance
 */
let firebaseServices: FirebaseServices | null = null;

/**
 * Get Firebase Services (Singleton Pattern)
 */
export function getFirebaseServices(): FirebaseServices {
  if (!firebaseServices) {
    const app = initializeFirebaseApp();
    firebaseServices = initializeFirebaseServices(app);
  }
  
  return firebaseServices;
}

/**
 * Individual service getters for convenience
 */
export function getDB(): Firestore {
  return getFirebaseServices().db;
}

export function getFirebaseAuth(): Auth {
  return getFirebaseServices().auth;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  return getFirebaseServices().storage;
}

/**
 * Firebase Connection Status Check
 */
export async function checkFirebaseConnection(): Promise<boolean> {
  try {
    const db = getDB();
    
    // Test connection with a simple Firestore operation
    // Try to get a non-existent document (minimal network call)
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    
    console.log('✅ Firebase connection is healthy');
    return true;
  } catch (error: any) {
    // If it's a permission error, connection is actually working
    if (error?.code === 'permission-denied') {
      console.log('✅ Firebase connection is healthy (permission check)');
      return true;
    }
    
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}

/**
 * Environment Configuration Helper
 */
export const firebaseEnv = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  useEmulator: process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true',
  projectId: firebaseConfig.projectId,
  region: process.env.REACT_APP_FIREBASE_REGION || 'us-central1',
} as const;

/**
 * Export Firebase config for debugging (development only)
 */
export const getFirebaseConfig = (): FirebaseConfig | null => {
  if (process.env.NODE_ENV === 'development') {
    return { ...firebaseConfig };
  }
  return null;
};

// Initialize Firebase immediately when module is imported
try {
  getFirebaseServices();
} catch (error) {
  console.error('❌ Failed to initialize Firebase on module import:', error);
}