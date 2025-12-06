import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
import { validateSession, isAdmin } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const session = await validateSession(token);
  
  if (!session.valid || !session.email) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const requesterCheck = await isAdmin(session.email);
  
  if (!requesterCheck.isAdmin || requesterCheck.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Only super admins can add new admins' });
  }

  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const adminRef = adminDb.collection('admins');
    const existingSnapshot = await adminRef.where('email', '==', email.toLowerCase()).get();
    
    if (!existingSnapshot.empty) {
      return res.status(400).json({ error: 'This email is already an admin' });
    }

    await adminRef.add({
      email: email.toLowerCase(),
      role: role || 'editor',
      createdAt: Date.now(),
      addedBy: session.email,
    });

    return res.status(201).json({ message: 'Admin added successfully' });
  } catch (error) {
    console.error('Error adding admin:', error);
    return res.status(500).json({ error: 'Failed to add admin' });
  }
}
