import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccount) {
      try {
        let parsed = JSON.parse(serviceAccount);
        
        if (parsed.private_key) {
          parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        
        initializeApp({
          credential: cert(parsed),
        });
        console.log('Firebase Admin initialized with service account');
      } catch (error) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY configuration');
      }
    } else {
      console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is required');
    }
  }
  return getFirestore();
}

export const adminDb = getFirebaseAdmin();
