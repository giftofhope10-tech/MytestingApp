import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOTP } from '../../lib/otp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const result = await verifyOTP(email, code);

  if (result.valid) {
    return res.status(200).json({ verified: true, message: result.message });
  } else {
    return res.status(400).json({ verified: false, message: result.message });
  }
}
