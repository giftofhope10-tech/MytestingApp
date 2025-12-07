import type { NextApiRequest, NextApiResponse } from 'next';
import { validateSession, isAdmin } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const session = await validateSession(sessionToken);
    
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
    console.error('Session verify error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
