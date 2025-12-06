import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const adminRef = adminDb.collection('admins');
    const snapshot = await adminRef.where('email', '==', email.toLowerCase()).get();
    
    if (snapshot.empty) {
      return res.status(200).json({ isAdmin: false });
    }

    let adminData: any = null;
    snapshot.forEach((doc) => {
      adminData = doc.data();
    });

    return res.status(200).json({ 
      isAdmin: true, 
      role: adminData.role || 'editor' 
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.status(500).json({ error: 'Failed to check admin status' });
  }
}
