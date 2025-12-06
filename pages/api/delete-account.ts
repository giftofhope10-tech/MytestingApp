import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, type } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const db = adminDb;

    if (type === 'developer') {
      const appsSnapshot = await db.collection('apps').where('developerEmail', '==', email).get();
      
      const hasActiveApps = appsSnapshot.docs.some(doc => doc.data().status === 'active');
      if (hasActiveApps) {
        return res.status(400).json({ error: 'Cannot delete account with active testing polls' });
      }

      const batch = db.batch();
      
      for (const doc of appsSnapshot.docs) {
        const requestsSnapshot = await db.collection('testerRequests').where('appId', '==', doc.data().appId).get();
        requestsSnapshot.docs.forEach(reqDoc => batch.delete(reqDoc.ref));
        batch.delete(doc.ref);
      }

      const otpDoc = db.collection('otps').doc(normalizedEmail);
      const otpSnapshot = await otpDoc.get();
      if (otpSnapshot.exists) batch.delete(otpDoc);

      const verifiedDoc = db.collection('verifiedEmails').doc(normalizedEmail);
      const verifiedSnapshot = await verifiedDoc.get();
      if (verifiedSnapshot.exists) batch.delete(verifiedDoc);

      await batch.commit();
    } else if (type === 'tester') {
      const requestsSnapshot = await db.collection('testerRequests').where('testerEmail', '==', email).get();
      
      const hasActiveTesting = requestsSnapshot.docs.some(doc => {
        const data = doc.data();
        return data.status === 'approved' && data.daysTested < 14;
      });
      
      if (hasActiveTesting) {
        return res.status(400).json({ error: 'Cannot delete account with active testing in progress' });
      }

      const batch = db.batch();
      requestsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

      const otpDoc = db.collection('otps').doc(normalizedEmail);
      const otpSnapshot = await otpDoc.get();
      if (otpSnapshot.exists) batch.delete(otpDoc);

      const verifiedDoc = db.collection('verifiedEmails').doc(normalizedEmail);
      const verifiedSnapshot = await verifiedDoc.get();
      if (verifiedSnapshot.exists) batch.delete(verifiedDoc);

      await batch.commit();
    }

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Failed to delete account:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
}
