import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COLLECTION = 'sessions';
const SESSION_EXPIRY_HOURS = 24;

interface SessionData {
  token: string;
  email: string;
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt: FirebaseFirestore.Timestamp;
}

export async function createSession(email: string): Promise<string> {
  const normalizedEmail = email.toLowerCase();
  const token = uuidv4();
  
  const existingSessionsSnapshot = await adminDb
    .collection(SESSION_COLLECTION)
    .where('email', '==', normalizedEmail)
    .get();
  
  const batch = adminDb.batch();
  existingSessionsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
  );

  await adminDb.collection(SESSION_COLLECTION).doc(token).set({
    token,
    email: normalizedEmail,
    createdAt: now,
    expiresAt,
  });

  return token;
}

export async function validateSession(token: string): Promise<{ valid: boolean; email?: string }> {
  if (!token) {
    return { valid: false };
  }

  try {
    const sessionDoc = await adminDb.collection(SESSION_COLLECTION).doc(token).get();
    
    if (!sessionDoc.exists) {
      return { valid: false };
    }

    const data = sessionDoc.data() as SessionData;
    const now = Timestamp.now();

    if (now.toMillis() > data.expiresAt.toMillis()) {
      await adminDb.collection(SESSION_COLLECTION).doc(token).delete();
      return { valid: false };
    }

    return { valid: true, email: data.email };
  } catch (error) {
    console.error('Error validating session:', error);
    return { valid: false };
  }
}

export async function deleteSession(token: string): Promise<void> {
  if (token) {
    await adminDb.collection(SESSION_COLLECTION).doc(token).delete();
  }
}

export async function isAdmin(email: string): Promise<{ isAdmin: boolean; role?: string }> {
  try {
    const adminRef = adminDb.collection('admins');
    const snapshot = await adminRef.where('email', '==', email.toLowerCase()).get();
    
    if (snapshot.empty) {
      return { isAdmin: false };
    }

    let adminData: any = null;
    snapshot.forEach((doc) => {
      adminData = doc.data();
    });

    return { isAdmin: true, role: adminData.role || 'editor' };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false };
  }
}
