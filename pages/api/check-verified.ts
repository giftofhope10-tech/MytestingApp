import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const snapshot = await adminDb
      .collection('verifiedEmails')
      .doc(normalizedEmail)
      .get();

    const isVerified = snapshot.exists;

    return res.status(200).json({ verified: isVerified });
  } catch (error) {
    console.error('Failed to check verification:', error);
    return res.status(500).json({ error: 'Failed to check verification status' });
  }
}
