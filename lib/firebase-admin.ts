import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function parseServiceAccountKey(key: string): Record<string, unknown> {
  let parsed: Record<string, unknown>;
  
  try {
    parsed = JSON.parse(key);
  } catch {
    const trimmed = key.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      try {
        const unwrapped = JSON.parse(trimmed);
        parsed = JSON.parse(unwrapped);
      } catch {
        throw new Error('Failed to parse service account key - check for extra quotes');
      }
    } else {
      throw new Error('Invalid JSON in service account key');
    }
  }
  
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new Error('Service account key is a string, not an object');
    }
  }
  
  return parsed;
}

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccount) {
      console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is required');
    }
    
    try {
      const parsed = parseServiceAccountKey(serviceAccount);
      
      if (!parsed.project_id || !parsed.private_key || !parsed.client_email) {
        throw new Error('Service account key missing required fields (project_id, private_key, client_email)');
      }
      
      if (typeof parsed.private_key === 'string') {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      
      initializeApp({
        credential: cert(parsed as Parameters<typeof cert>[0]),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization failed:', error);
      throw error;
    }
  }
  return getFirestore();
}

export const adminDb = getFirebaseAdmin();
