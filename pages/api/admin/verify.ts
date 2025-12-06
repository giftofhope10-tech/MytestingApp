import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionToken } = req.body;

    if (!sessionToken || sessionToken.length !== 64) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Session verify error:', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
