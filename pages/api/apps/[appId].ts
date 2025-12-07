import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
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
  const { appId } = req.query;

  if (req.method === 'GET') {
    try {
      const appsRef = adminDb.collection('apps');
      const snapshot = await appsRef.where('appId', '==', appId).get();
      
      if (snapshot.empty) {
        return res.status(404).json({ error: 'App not found' });
      }

      let appData: App | null = null;
      snapshot.forEach((doc) => {
        appData = { appId: doc.id, ...doc.data() } as App;
      });
      
      return res.status(200).json(appData);
    } catch (error) {
      console.error('Error fetching app:', error);
      return res.status(500).json({ error: 'Failed to fetch app' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, developerEmail } = req.body;
      
      const appsRef = adminDb.collection('apps');
      const snapshot = await appsRef.where('appId', '==', appId).get();
      
      if (snapshot.empty) {
        return res.status(404).json({ error: 'App not found' });
      }

      let appDocRef: FirebaseFirestore.DocumentReference | null = null;
      let appData: any = null;
      snapshot.forEach((docSnap) => {
        appDocRef = docSnap.ref;
        appData = docSnap.data();
      });

      if (appData.developerEmail !== developerEmail) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await appDocRef!.update({ status });

      if (status === 'completed') {
        const developersRef = adminDb.collection('developers');
        const devSnapshot = await developersRef.where('developerEmail', '==', developerEmail).get();
        
        const batch = adminDb.batch();
        devSnapshot.forEach((docSnap) => {
          batch.update(docSnap.ref, { activeAppId: null });
        });
        await batch.commit();
      }

      return res.status(200).json({ message: 'App updated successfully' });
    } catch (error) {
      console.error('Error updating app:', error);
      return res.status(500).json({ error: 'Failed to update app' });
    }
  }

  if (req.method === 'DELETE') {
    const authResult = await validateAdminRequest(req);
    
    if (!authResult.valid) {
      return res.status(401).json({ error: authResult.error });
    }

    try {
      const appsRef = adminDb.collection('apps');
      const snapshot = await appsRef.where('appId', '==', appId).get();
      
      if (snapshot.empty) {
        return res.status(404).json({ error: 'App not found' });
      }

      let appDocRef: FirebaseFirestore.DocumentReference | null = null;
      let appData: any = null;
      snapshot.forEach((docSnap) => {
        appDocRef = docSnap.ref;
        appData = docSnap.data();
      });

      const developerEmail = appData.developerEmail;
      const appName = appData.name;

      await appDocRef!.delete();

      const developersRef = adminDb.collection('developers');
      const devSnapshot = await developersRef.where('developerEmail', '==', developerEmail).get();
      
      if (!devSnapshot.empty) {
        const batch = adminDb.batch();
        devSnapshot.forEach((docSnap) => {
          const devData = docSnap.data();
          if (devData.activeAppId === appId) {
            batch.update(docSnap.ref, { activeAppId: null });
          }
        });
        await batch.commit();
      }

      const testerRequestsRef = adminDb.collection('testerRequests');
      const testerSnapshot = await testerRequestsRef.where('appId', '==', appId).get();
      
      if (!testerSnapshot.empty) {
        const batch = adminDb.batch();
        testerSnapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }

      const deletionLog = {
        appId,
        appName,
        developerEmail,
        deletedBy: authResult.email,
        reason: 'policy_concern',
        message: 'Your app has been removed due to policy concerns. Please contact our support team for more information.',
        deletedAt: Date.now(),
      };
      
      await adminDb.collection('deletedApps').add(deletionLog);

      return res.status(200).json({ 
        message: 'App deleted successfully',
        policyMessage: 'Your app has been removed due to policy concerns. Please contact our support team for more information.'
      });
    } catch (error) {
      console.error('Error deleting app:', error);
      return res.status(500).json({ error: 'Failed to delete app' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
