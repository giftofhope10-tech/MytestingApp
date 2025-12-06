import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { appId, testerEmail, developerEmail } = req.query;
      
      const requestsRef = collection(db, 'testerRequests');
      let q;
      
      if (appId) {
        q = query(requestsRef, where('appId', '==', appId));
      } else if (testerEmail) {
        q = query(requestsRef, where('testerEmail', '==', testerEmail));
      } else if (developerEmail) {
        const appsRef = collection(db, 'apps');
        const appsQuery = query(appsRef, where('developerEmail', '==', developerEmail));
        const appsSnapshot = await getDocs(appsQuery);
        
        const appIds: string[] = [];
        appsSnapshot.forEach((doc) => {
          appIds.push(doc.data().appId);
        });
        
        if (appIds.length === 0) {
          return res.status(200).json([]);
        }
        
        const allRequests: any[] = [];
        for (const id of appIds) {
          const reqQuery = query(requestsRef, where('appId', '==', id));
          const reqSnapshot = await getDocs(reqQuery);
          reqSnapshot.forEach((doc) => {
            allRequests.push({ id: doc.id, ...doc.data() });
          });
        }
        
        return res.status(200).json(allRequests);
      } else {
        return res.status(400).json({ error: 'Query parameter required' });
      }
      
      const snapshot = await getDocs(q!);
      const requests: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
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

      const requestsRef = collection(db, 'testerRequests');
      const existingQuery = query(
        requestsRef, 
        where('testerEmail', '==', testerEmail),
        where('appId', '==', appId)
      );
      const existingSnapshot = await getDocs(existingQuery);

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

      await addDoc(collection(db, 'testerRequests'), newRequest);

      return res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
      console.error('Error creating request:', error);
      return res.status(500).json({ error: 'Failed to submit request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
