import type { NextApiRequest, NextApiResponse } from 'next';
import { createSession, validateSession, deleteSession, isAdmin } from '../../../lib/session';
import { adminDb } from '../../../lib/firebase-admin';

const VERIFICATION_WINDOW_MS = 5 * 60 * 1000;

async function wasRecentlyVerified(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase();
  const docRef = adminDb.collection('verifiedEmails').doc(normalizedEmail);
  
  try {
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return false;
    }
    
    const data = docSnap.data();
    if (!data?.verifiedAt) {
      return false;
    }
    
    const verifiedAt = data.verifiedAt.toMillis();
    const now = Date.now();
    
    if (now - verifiedAt > VERIFICATION_WINDOW_MS) {
      return false;
    }
    
    await docRef.delete();
    
    return true;
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      const recentlyVerified = await wasRecentlyVerified(email);
      
      if (!recentlyVerified) {
        return res.status(401).json({ error: 'OTP verification required. Please verify your email first.' });
      }
      
      const adminCheck = await isAdmin(email);
      
      if (!adminCheck.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized: Only admins can access this panel' });
      }

      const token = await createSession(email);

      return res.status(200).json({ 
        success: true, 
        token,
        role: adminCheck.role,
        email: email.toLowerCase()
      });
    } catch (error) {
      console.error('Error creating session:', error);
      return res.status(500).json({ error: 'Failed to create session' });
    }
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    try {
      const session = await validateSession(token);
      
      if (!session.valid || !session.email) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      const adminCheck = await isAdmin(session.email);
      
      if (!adminCheck.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      return res.status(200).json({ 
        valid: true,
        email: session.email,
        role: adminCheck.role
      });
    } catch (error) {
      console.error('Error validating session:', error);
      return res.status(500).json({ error: 'Failed to validate session' });
    }
  }

  if (req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      try {
        await deleteSession(token);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
