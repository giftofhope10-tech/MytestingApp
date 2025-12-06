import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

const OTP_COLLECTION = 'otps';
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

interface OTPData {
  code: string;
  expiresAt: FirebaseFirestore.Timestamp;
  attempts: number;
  email: string;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email: string, code: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const docRef = adminDb.collection(OTP_COLLECTION).doc(normalizedEmail);
  
  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  );

  await docRef.set({
    code,
    expiresAt,
    attempts: 0,
    email: normalizedEmail,
  });
}

export async function verifyOTP(email: string, code: string): Promise<{ valid: boolean; message: string }> {
  const normalizedEmail = email.toLowerCase();
  const docRef = adminDb.collection(OTP_COLLECTION).doc(normalizedEmail);
  
  try {
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    const data = docSnap.data() as OTPData;
    const now = Timestamp.now();

    if (now.toMillis() > data.expiresAt.toMillis()) {
      await docRef.delete();
      return { valid: false, message: 'OTP expired. Please request a new one.' };
    }

    if (data.attempts >= MAX_ATTEMPTS) {
      await docRef.delete();
      return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
    }

    if (data.code !== code) {
      await docRef.update({ attempts: data.attempts + 1 });
      return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    await docRef.delete();
    return { valid: true, message: 'OTP verified successfully.' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { valid: false, message: 'Verification failed. Please try again.' };
  }
}

export async function getStoredOTP(email: string): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  const docRef = adminDb.collection(OTP_COLLECTION).doc(normalizedEmail);
  
  try {
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data() as OTPData;
    const now = Timestamp.now();

    if (now.toMillis() <= data.expiresAt.toMillis()) {
      return data.code;
    }

    return null;
  } catch (error) {
    console.error('Error getting OTP:', error);
    return null;
  }
}
