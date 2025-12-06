import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { testerEmail, appId } = req.body;

  if (!testerEmail || !appId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const requestsRef = collection(db, 'testerRequests');
    const q = query(
      requestsRef,
      where('testerEmail', '==', testerEmail),
      where('appId', '==', appId),
      where('status', '==', 'approved')
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No approved test request found' });
    }

    let requestDocId = '';
    let requestData: any = null;
    snapshot.forEach((docSnap) => {
      requestDocId = docSnap.id;
      requestData = docSnap.data();
    });

    const today = new Date().toISOString().split('T')[0];
    
    if (requestData.lastTestDate === today) {
      return res.status(400).json({ error: 'You have already checked in today. Come back tomorrow!' });
    }

    const newDaysTested = (requestData.daysTested || 0) + 1;

    await updateDoc(doc(db, 'testerRequests', requestDocId), {
      daysTested: newDaysTested,
      lastTestDate: today,
    });

    return res.status(200).json({ 
      message: `Check-in successful! Day ${newDaysTested} completed.`,
      daysTested: newDaysTested,
    });
  } catch (error) {
    console.error('Error checking in:', error);
    return res.status(500).json({ error: 'Failed to check in' });
  }
}
