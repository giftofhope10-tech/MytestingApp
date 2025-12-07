import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { appId, testerEmail, developerEmail } = req.query;
      
      const requestsRef = adminDb.collection('testerRequests');
      let snapshot;
      
      if (appId) {
        snapshot = await requestsRef.where('appId', '==', appId).get();
      } else if (testerEmail) {
        snapshot = await requestsRef.where('testerEmail', '==', testerEmail).get();
      } else if (developerEmail) {
        const appsRef = adminDb.collection('apps');
        const appsSnapshot = await appsRef.where('developerEmail', '==', developerEmail).get();
        
        const appIds: string[] = [];
        appsSnapshot.forEach((doc) => {
          appIds.push(doc.data().appId);
        });
        
        if (appIds.length === 0) {
          return res.status(200).json([]);
        }
        
        const allRequests: any[] = [];
        for (const id of appIds) {
          const reqSnapshot = await requestsRef.where('appId', '==', id).get();
          reqSnapshot.forEach((doc) => {
            allRequests.push({ id: doc.id, ...doc.data() });
          });
        }
        
        return res.status(200).json(allRequests);
      } else {
        return res.status(400).json({ error: 'Query parameter required' });
      }
      
      const requests: object[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>;
        requests.push({ id: docSnap.id, ...data });
      });
      
      return res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      return res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { testerEmail, appId } = req.body;

      if (!testerEmail || !appId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const appsRef = adminDb.collection('apps');
      const appSnapshot = await appsRef.where('appId', '==', appId).get();
      
      if (appSnapshot.empty) {
        return res.status(404).json({ error: 'App not found' });
      }

      const appData = appSnapshot.docs[0].data();
      
      if (appData.developerEmail.toLowerCase() === testerEmail.toLowerCase()) {
        return res.status(400).json({ error: 'You cannot test your own app.' });
      }

      if (appData.status === 'completed') {
        return res.status(400).json({ error: 'This app is no longer accepting new testers.' });
      }

      const requestsRef = adminDb.collection('testerRequests');
      const existingSnapshot = await requestsRef
        .where('testerEmail', '==', testerEmail)
        .where('appId', '==', appId)
        .get();

      if (!existingSnapshot.empty) {
        return res.status(400).json({ error: 'You have already requested to test this app.' });
      }

      const newRequest = {
        id: uuidv4(),
        testerEmail,
        appId,
        status: 'pending',
        daysTested: 0,
        lastTestDate: null,
        requestedAt: Date.now(),
      };

      await adminDb.collection('testerRequests').add(newRequest);

      return res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
      console.error('Error creating request:', error);
      return res.status(500).json({ error: 'Failed to submit request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
