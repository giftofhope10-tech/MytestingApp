import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { status, daysTested, lastTestDate, rating, feedback, developerEmail, testerEmail } = req.body;
      
      const requestsRef = collection(db, 'testerRequests');
      const q = query(requestsRef, where('id', '==', id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return res.status(404).json({ error: 'Request not found' });
      }

      let requestDocId = '';
      let requestData: any = null;
      snapshot.forEach((docSnap) => {
        requestDocId = docSnap.id;
        requestData = docSnap.data();
      });

      const updateData: any = {};
      
      if (status !== undefined) {
        if (developerEmail) {
          const appsRef = collection(db, 'apps');
          const appQuery = query(appsRef, where('appId', '==', requestData.appId));
          const appSnapshot = await getDocs(appQuery);
          
          let authorized = false;
          appSnapshot.forEach((docSnap) => {
            if (docSnap.data().developerEmail === developerEmail) {
              authorized = true;
            }
          });
          
          if (!authorized) {
            return res.status(403).json({ error: 'Unauthorized' });
          }
        }
        updateData.status = status;
        if (status === 'approved') {
          updateData.approvedAt = Date.now();
        }
      }

      if (daysTested !== undefined) {
        if (requestData.testerEmail !== testerEmail) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
        updateData.daysTested = daysTested;
      }

      if (lastTestDate !== undefined) {
        updateData.lastTestDate = lastTestDate;
      }

      if (rating !== undefined) {
        updateData.rating = rating;
        
        const appsRef = collection(db, 'apps');
        const appQuery = query(appsRef, where('appId', '==', requestData.appId));
        const appSnapshot = await getDocs(appQuery);
        
        appSnapshot.forEach(async (docSnap) => {
          const appData = docSnap.data();
          const newTotalRatings = (appData.totalRatings || 0) + 1;
          const newRating = ((appData.rating || 0) * (appData.totalRatings || 0) + rating) / newTotalRatings;
          
          await updateDoc(doc(db, 'apps', docSnap.id), {
            rating: newRating,
            totalRatings: newTotalRatings,
          });
        });
      }

      if (feedback !== undefined) {
        updateData.feedback = feedback;
      }

      if (daysTested >= 14) {
        updateData.completedBadge = true;
      }

      await updateDoc(doc(db, 'testerRequests', requestDocId), updateData);

      return res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
      console.error('Error updating request:', error);
      return res.status(500).json({ error: 'Failed to update request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
