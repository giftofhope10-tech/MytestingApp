# Close Testing Group

A web platform for managing Google Play closed testing programs. Developers can submit apps for testing, and testers can join testing programs with email verification.

## Tech Stack
- **Frontend**: Next.js with React and TailwindCSS
- **Database**: Firebase Firestore
- **Email**: Resend for OTP verification
- **Hosting**: Runs on port 5000

## Project Structure

```
├── pages/
│   ├── index.tsx          # Home page with app listings
│   ├── submit.tsx         # Developer app submission (3-step wizard)
│   ├── developer.tsx      # Developer dashboard
│   ├── tester.tsx         # Tester dashboard with check-in
│   ├── app/
│   │   └── [appId].tsx    # App details and tester request
│   └── api/
│       ├── apps.ts        # GET/POST apps
│       ├── apps/[appId].ts # GET/PATCH single app
│       ├── send-otp.ts    # Send OTP email
│       ├── verify-otp.ts  # Verify OTP code
│       ├── tester-requests.ts    # GET/POST tester requests
│       ├── tester-requests/[id].ts # PATCH request status
│       └── check-in.ts    # Daily tester check-in
├── components/
│   ├── Layout.tsx         # Main layout with navigation
│   ├── AppCard.tsx        # App card display
│   ├── OTPVerification.tsx # Email OTP component
│   └── ProgressBar.tsx    # 14-day progress tracker
├── lib/
│   ├── firebase.ts        # Firebase client config
│   ├── firebase-admin.ts  # Firebase admin config
│   ├── otp.ts             # OTP generation/verification
│   ├── tempmail.ts        # Temporary email detection
│   └── types.ts           # TypeScript interfaces
└── styles/
    └── globals.css        # Global styles with Tailwind
```

## Required Environment Variables

Add these in the Secrets tab:
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase App ID
- `RESEND_API_KEY` - Resend API key for emails

## Features

### For Developers
- Submit apps with 3-step wizard (app info, Play Store link, contact)
- Email verification via OTP
- Dashboard to approve/reject tester requests
- View tester statistics and progress

### For Testers
- Browse available apps for testing
- Request to join testing programs
- Daily check-in system (14-day tracking)
- Progress visualization
- Rate apps after testing period

### Security
- OTP email verification for all users
- Temporary email detection (blocks disposable emails)
- Session management

## Development

The app runs on port 5000. Start with:
```bash
npm run dev
```

## Deployment

Configure for Vercel or similar Next.js hosting. Ensure all environment variables are set in production.
