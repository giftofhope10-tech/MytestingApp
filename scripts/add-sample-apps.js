const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const sampleApps = [
  {
    appId: 'app-001-puzzle-master',
    developerEmail: 'developer1@example.com',
    name: 'Puzzle Master Pro',
    packageName: 'com.puzzlemaster.pro',
    playLink: 'https://play.google.com/store/apps/details?id=com.puzzlemaster.pro',
    iconUrl: 'https://img.icons8.com/color/96/puzzle.png',
    description: 'Challenge your brain with 500+ unique puzzles. Features daily challenges and multiplayer mode.',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.7,
    totalRatings: 156,
  },
  {
    appId: 'app-002-fitness-tracker',
    developerEmail: 'developer2@example.com',
    name: 'FitLife Tracker',
    packageName: 'com.fitlife.tracker',
    playLink: 'https://play.google.com/store/apps/details?id=com.fitlife.tracker',
    iconUrl: 'https://img.icons8.com/color/96/heart-health.png',
    description: 'Track your workouts, calories, and health goals. Sync with wearable devices.',
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.5,
    totalRatings: 203,
  },
  {
    appId: 'app-003-recipe-book',
    developerEmail: 'developer3@example.com',
    name: 'Recipe Book Deluxe',
    packageName: 'com.recipebook.deluxe',
    playLink: 'https://play.google.com/store/apps/details?id=com.recipebook.deluxe',
    iconUrl: 'https://img.icons8.com/color/96/cookbook.png',
    description: 'Discover 10,000+ recipes from around the world. Save favorites and create shopping lists.',
    createdAt: Date.now() - 22 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.8,
    totalRatings: 89,
  },
  {
    appId: 'app-004-language-learn',
    developerEmail: 'developer4@example.com',
    name: 'LinguaPro Learn',
    packageName: 'com.linguapro.learn',
    playLink: 'https://play.google.com/store/apps/details?id=com.linguapro.learn',
    iconUrl: 'https://img.icons8.com/color/96/language.png',
    description: 'Learn 20+ languages with interactive lessons, native speakers, and AI practice.',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.6,
    totalRatings: 312,
  },
  {
    appId: 'app-005-photo-editor',
    developerEmail: 'developer5@example.com',
    name: 'SnapEdit Pro',
    packageName: 'com.snapedit.pro',
    playLink: 'https://play.google.com/store/apps/details?id=com.snapedit.pro',
    iconUrl: 'https://img.icons8.com/color/96/camera.png',
    description: 'Professional photo editing with 100+ filters, AI enhancement, and collage maker.',
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.4,
    totalRatings: 178,
  },
  {
    appId: 'app-006-budget-manager',
    developerEmail: 'developer6@example.com',
    name: 'Budget Buddy',
    packageName: 'com.budgetbuddy.app',
    playLink: 'https://play.google.com/store/apps/details?id=com.budgetbuddy.app',
    iconUrl: 'https://img.icons8.com/color/96/money-bag.png',
    description: 'Smart expense tracking with AI insights. Set budgets and achieve financial goals.',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.9,
    totalRatings: 245,
  },
  {
    appId: 'app-007-meditation',
    developerEmail: 'developer7@example.com',
    name: 'ZenMind Meditation',
    packageName: 'com.zenmind.meditation',
    playLink: 'https://play.google.com/store/apps/details?id=com.zenmind.meditation',
    iconUrl: 'https://img.icons8.com/color/96/spa-flower.png',
    description: 'Guided meditation sessions, sleep sounds, and breathing exercises for inner peace.',
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.7,
    totalRatings: 134,
  },
  {
    appId: 'app-008-note-taking',
    developerEmail: 'developer8@example.com',
    name: 'QuickNote Plus',
    packageName: 'com.quicknote.plus',
    playLink: 'https://play.google.com/store/apps/details?id=com.quicknote.plus',
    iconUrl: 'https://img.icons8.com/color/96/note.png',
    description: 'Fast note-taking with voice recording, handwriting, and cloud sync across devices.',
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.5,
    totalRatings: 167,
  },
  {
    appId: 'app-009-weather-app',
    developerEmail: 'developer9@example.com',
    name: 'WeatherNow Pro',
    packageName: 'com.weathernow.pro',
    playLink: 'https://play.google.com/store/apps/details?id=com.weathernow.pro',
    iconUrl: 'https://img.icons8.com/color/96/partly-cloudy-day.png',
    description: 'Accurate weather forecasts with radar maps, severe weather alerts, and hourly updates.',
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.6,
    totalRatings: 298,
  },
  {
    appId: 'app-010-task-manager',
    developerEmail: 'developer10@example.com',
    name: 'TaskFlow Manager',
    packageName: 'com.taskflow.manager',
    playLink: 'https://play.google.com/store/apps/details?id=com.taskflow.manager',
    iconUrl: 'https://img.icons8.com/color/96/checked-checkbox.png',
    description: 'Organize tasks with Kanban boards, reminders, and team collaboration features.',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: 'completed',
    rating: 4.8,
    totalRatings: 221,
  },
];

async function addSampleApps() {
  console.log('Adding 10 sample completed apps...');
  
  for (const app of sampleApps) {
    try {
      const existingApp = await db.collection('apps').where('appId', '==', app.appId).get();
      
      if (existingApp.empty) {
        await db.collection('apps').add(app);
        console.log(`Added: ${app.name}`);
      } else {
        console.log(`Already exists: ${app.name}`);
      }
    } catch (error) {
      console.error(`Error adding ${app.name}:`, error.message);
    }
  }
  
  console.log('Done adding sample apps!');
}

addSampleApps().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
