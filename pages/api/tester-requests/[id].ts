import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { status, daysTested, lastTestDate, rating, feedback, developerEmail, testerEmail } = req.body;
      
      const requestsRef = adminDb.collection('testerRequests');
      const snapshot = await requestsRef.where('id', '==', id).get();
      
      if (snapshot.empty) {
        return res.status(404).json({ error: 'Request not found' });
      }

      let requestDocRef: FirebaseFirestore.DocumentReference | null = null;
      let requestData: any = null;
      snapshot.forEach((docSnap) => {
        requestDocRef = docSnap.ref;
        requestData = docSnap.data();
      });

      const updateData: any = {};
      
      if (status !== undefined) {
        if (developerEmail) {
          const appsRef = adminDb.collection('apps');
          const appSnapshot = await appsRef.where('appId', '==', requestData.appId).get();
          
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
        
        const appsRef = adminDb.collection('apps');
        const appSnapshot = await appsRef.where('appId', '==', requestData.appId).get();
        
        const batch = adminDb.batch();
        appSnapshot.forEach((docSnap) => {
          const appData = docSnap.data();
          const newTotalRatings = (appData.totalRatings || 0) + 1;
          const newRating = ((appData.rating || 0) * (appData.totalRatings || 0) + rating) / newTotalRatings;
          
          batch.update(docSnap.ref, {
            rating: newRating,
            totalRatings: newTotalRatings,
          });
        });
        await batch.commit();
      }

      if (feedback !== undefined) {
        updateData.feedback = feedback;
      }

      if (daysTested >= 14) {
        updateData.completedBadge = true;
      }

      await requestDocRef!.update(updateData);

      return res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
      console.error('Error updating request:', error);
      return res.status(500).json({ error: 'Failed to update request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
