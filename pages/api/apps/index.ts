import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { validateSession, isAdmin } from '../../../lib/session';
import type { App } from '../../../lib/types';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { adminView } = req.query;
      
      if (adminView) {
        const authResult = await validateAdminRequest(req);
        
        if (!authResult.valid) {
          return res.status(401).json({ error: authResult.error });
        }
      }
      
      const appsRef = adminDb.collection('apps');
      const snapshot = await appsRef.orderBy('createdAt', 'desc').get();
      
      const apps: App[] = [];
      snapshot.forEach((doc) => {
        apps.push({ appId: doc.id, ...doc.data() } as App);
      });
      
      if (!adminView) {
        return res.status(200).json(apps.filter(app => app.status === 'active'));
      }
      
      return res.status(200).json(apps);
    } catch (error) {
      console.error('Error fetching apps:', error);
      return res.status(500).json({ error: 'Failed to fetch apps' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, packageName, playLink, iconUrl, developerEmail, description } = req.body;

      if (!name || !packageName || !playLink || !developerEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const developersRef = adminDb.collection('developers');
      const devSnapshot = await developersRef.where('developerEmail', '==', developerEmail).get();

      const appId = uuidv4();
      const newApp = {
        appId,
        developerEmail,
        name,
        packageName,
        playLink,
        iconUrl: iconUrl || '/default-icon.png',
        description: description || '',
        createdAt: Date.now(),
        status: 'active',
        rating: 0,
        totalRatings: 0,
      };

      await adminDb.collection('apps').add(newApp);

      if (devSnapshot.empty) {
        await adminDb.collection('developers').add({
          developerEmail,
          verified: true,
          activeAppId: appId,
          createdAt: Date.now(),
        });
      } else {
        const batch = adminDb.batch();
        devSnapshot.forEach((docSnap) => {
          batch.update(docSnap.ref, {
            activeAppId: appId,
            verified: true,
          });
        });
        await batch.commit();
      }

      return res.status(201).json({ appId, message: 'App submitted successfully' });
    } catch (error) {
      console.error('Error creating app:', error);
      return res.status(500).json({ error: 'Failed to submit app' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
