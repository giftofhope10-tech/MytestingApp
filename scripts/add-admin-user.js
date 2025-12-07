const admin = require('firebase-admin');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccount) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(serviceAccount);
  if (typeof parsed === 'string') {
    parsed = JSON.parse(parsed);
  }
  if (typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
} catch (error) {
  console.error('Failed to parse service account key:', error.message);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(parsed),
  });
}

const db = admin.firestore();

async function addAdminUser() {
  const adminEmail = 'admin@closetestinggroup.com';
  
  try {
    const existing = await db.collection('admins').where('email', '==', adminEmail).get();
    
    if (!existing.empty) {
      console.log(`Admin user ${adminEmail} already exists`);
      return;
    }
    
    await db.collection('admins').add({
      email: adminEmail,
      role: 'admin',
      createdAt: admin.firestore.Timestamp.now(),
    });
    
    console.log(`Successfully added admin user: ${adminEmail}`);
  } catch (error) {
    console.error('Error adding admin user:', error);
    process.exit(1);
  }
}

addAdminUser().then(() => process.exit(0));
