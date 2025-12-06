import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import type { App } from '../../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { appId } = req.query;

  if (req.method === 'GET') {
    try {
      const appsRef = collection(db, 'apps');
      const q = query(appsRef, where('appId', '==', appId));
      const snapshot = await getDocs(q);
      
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
      
      const appsRef = collection(db, 'apps');
      const q = query(appsRef, where('appId', '==', appId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return res.status(404).json({ error: 'App not found' });
      }

      let appDocId = '';
      let appData: any = null;
      snapshot.forEach((docSnap) => {
        appDocId = docSnap.id;
        appData = docSnap.data();
      });

      if (appData.developerEmail !== developerEmail) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await updateDoc(doc(db, 'apps', appDocId), { status });

      if (status === 'completed') {
        const developersRef = collection(db, 'developers');
        const devQuery = query(developersRef, where('developerEmail', '==', developerEmail));
        const devSnapshot = await getDocs(devQuery);
        
        devSnapshot.forEach(async (docSnap) => {
          await updateDoc(doc(db, 'developers', docSnap.id), {
            activeAppId: null,
          });
        });
      }

      return res.status(200).json({ message: 'App updated successfully' });
    } catch (error) {
      console.error('Error updating app:', error);
      return res.status(500).json({ error: 'Failed to update app' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
