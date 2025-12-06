import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
import type { App } from '../../../lib/types';

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

  return res.status(405).json({ error: 'Method not allowed' });
}
