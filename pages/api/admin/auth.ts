import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { createSession } from '../../../lib/session';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const storedHashedToken = process.env.ADMIN_TOKEN_HASH;

    if (!storedHashedToken) {
      console.error('ADMIN_TOKEN_HASH environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const inputHashedToken = hashToken(token);

    if (inputHashedToken === storedHashedToken) {
      const adminEmail = 'admin@closetestinggroup.com';
      const sessionToken = await createSession(adminEmail);
      
      return res.status(200).json({ 
        success: true, 
        sessionToken,
        message: 'Authentication successful' 
      });
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
