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

  if (!type || !['developer', 'tester', 'both'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const db = adminDb;
    const batch = db.batch();
    const deletedTesterRequestIds = new Set<string>();

    if (type === 'developer' || type === 'both') {
      const appsSnapshot = await db.collection('apps').where('developerEmail', '==', normalizedEmail).get();
      
      const hasActiveApps = appsSnapshot.docs.some(doc => doc.data().status === 'active');
      if (hasActiveApps) {
        return res.status(400).json({ error: 'Cannot delete account with active testing polls' });
      }

      for (const doc of appsSnapshot.docs) {
        const requestsSnapshot = await db.collection('testerRequests').where('appId', '==', doc.data().appId).get();
        requestsSnapshot.docs.forEach(reqDoc => {
          if (!deletedTesterRequestIds.has(reqDoc.id)) {
            batch.delete(reqDoc.ref);
            deletedTesterRequestIds.add(reqDoc.id);
          }
        });
        batch.delete(doc.ref);
      }
    }

    if (type === 'tester' || type === 'both') {
      const testerRequestsSnapshot = await db.collection('testerRequests').where('testerEmail', '==', normalizedEmail).get();
      
      const hasActiveTesting = testerRequestsSnapshot.docs.some(doc => {
        const data = doc.data();
        return data.status === 'approved' && data.daysTested < 14;
      });
      
      if (hasActiveTesting) {
        return res.status(400).json({ error: 'Cannot delete account with active testing in progress' });
      }

      testerRequestsSnapshot.docs.forEach(doc => {
        if (!deletedTesterRequestIds.has(doc.id)) {
          batch.delete(doc.ref);
          deletedTesterRequestIds.add(doc.id);
        }
      });
    }

    const otpDoc = db.collection('otps').doc(normalizedEmail);
    const otpSnapshot = await otpDoc.get();
    if (otpSnapshot.exists) batch.delete(otpDoc);

    const verifiedDoc = db.collection('verifiedEmails').doc(normalizedEmail);
    const verifiedSnapshot = await verifiedDoc.get();
    if (verifiedSnapshot.exists) batch.delete(verifiedDoc);

    await batch.commit();

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Failed to delete account:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
}
