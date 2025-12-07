import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
import { validateSession, isAdmin } from '../../../lib/session';
import type { SiteSettings } from '../../../lib/types';

async function validateAdminRequest(req: NextApiRequest): Promise<{ valid: boolean; email?: string; error?: string }> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { valid: false, error: 'No session token provided' };
  }

  const session = await validateSession(token);
  
  if (!session.valid || !session.email) {
    return { valid: false, error: 'Invalid or expired session' };
  }

  const adminCheck = await isAdmin(session.email);
  
  if (!adminCheck.isAdmin) {
    return { valid: false, error: 'Unauthorized: Only admins can perform this action' };
  }

  return { valid: true, email: session.email };
}

const DEFAULT_SETTINGS: SiteSettings = {
  adsEnabled: false,
  adsenseClientId: '',
  adSlots: {
    header: '',
    sidebar: '',
    inArticle: '',
    footer: '',
  },
  updatedAt: Date.now(),
  updatedBy: 'system',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const settingsDoc = await adminDb.collection('settings').doc('ads').get();
      
      if (!settingsDoc.exists) {
        return res.status(200).json(DEFAULT_SETTINGS);
      }
      
      return res.status(200).json(settingsDoc.data());
    } catch (error) {
      console.error('Error fetching ad settings:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  if (req.method === 'PUT') {
    const authResult = await validateAdminRequest(req);
    
    if (!authResult.valid) {
      return res.status(401).json({ error: authResult.error });
    }

    try {
      const { adsEnabled, adsenseClientId, adSlots } = req.body;

      const updatedSettings: SiteSettings = {
        adsEnabled: Boolean(adsEnabled),
        adsenseClientId: adsenseClientId || '',
        adSlots: {
          header: adSlots?.header || '',
          sidebar: adSlots?.sidebar || '',
          inArticle: adSlots?.inArticle || '',
          footer: adSlots?.footer || '',
        },
        updatedAt: Date.now(),
        updatedBy: authResult.email || 'unknown',
      };

      await adminDb.collection('settings').doc('ads').set(updatedSettings);

      return res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings });
    } catch (error) {
      console.error('Error updating ad settings:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
