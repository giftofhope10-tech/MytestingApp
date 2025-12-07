# Close Testing Group

A web platform for managing Google Play closed testing programs. Developers can submit apps for testing, and testers can join testing programs.

## Tech Stack
- **Frontend**: Next.js 16 with React and TailwindCSS
- **Database**: Firebase Firestore
- **Email**: Resend for OTP verification
- **Hosting**: Runs on port 5000 (Vercel-ready)

## Project Structure

```
├── pages/
│   ├── index.tsx          # Home page with app listings
│   ├── submit.tsx         # Developer app submission
│   ├── dashboard.tsx      # User dashboard
│   ├── developer.tsx      # Developer dashboard
│   ├── tester.tsx         # Tester dashboard
│   ├── sitemap.xml.tsx    # Dynamic XML sitemap
│   ├── _document.tsx      # Custom document with preloading
│   ├── app/
│   │   └── [appId].tsx    # App details
│   ├── blog/
│   │   ├── index.tsx      # Blog listing
│   │   └── [slug].tsx     # Dynamic blog posts
│   ├── admin/
│   │   ├── index.tsx      # Admin panel (token auth)
│   │   ├── login.tsx      # Admin login
│   │   ├── dashboard.tsx  # Admin dashboard
│   │   ├── users.tsx      # User management
│   │   └── blog/          # Blog management
│   └── api/               # API endpoints
├── components/
│   ├── Layout.tsx         # Main layout with SEO
│   ├── AppCard.tsx        # App card display
│   ├── OTPVerification.tsx
│   └── ProgressBar.tsx
├── lib/
│   ├── firebase.ts        # Firebase client
│   ├── firebase-admin.ts  # Firebase admin
│   ├── otp.ts             # OTP logic
│   ├── tempmail.ts        # Temp email detection
│   ├── session.ts         # Session management
│   └── types.ts           # TypeScript types
├── public/
│   ├── robots.txt         # SEO robots file
│   ├── logo.png
│   └── favicon.ico
└── styles/
    └── globals.css
```

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase API key |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase project ID |
| NEXT_PUBLIC_FIREBASE_APP_ID | Firebase App ID |
| FIREBASE_SERVICE_ACCOUNT_KEY | Firebase admin SDK (JSON) |
| RESEND_API_KEY | Resend API key for emails |
| ADMIN_TOKEN_HASH | SHA-256 hash of admin token |

## Features

### For Developers
- Submit apps with verification
- Dashboard to manage testers
- View tester statistics

### For Testers
- Browse apps for testing
- Request to join programs
- Daily check-in system (14-day)
- Progress visualization

### Admin Panel
- Token-based authentication (no email required)
- Blog post management (create/edit/delete)
- User management

### SEO (Comprehensive - 100+ Keywords)
- **Configuration**: `lib/seo-config.ts` - 100+ targeted keywords
- **Component**: `components/SEOHead.tsx` - Enhanced meta tags
- **Documentation**: `SEO_KEYWORDS.md` - Full keyword strategy

#### Technical SEO
- robots.txt configured
- Dynamic sitemap.xml with priorities
- Open Graph meta tags
- Twitter Cards
- Canonical URLs
- JSON-LD structured data (Organization, WebSite, BreadcrumbList, FAQ, HowTo schemas)
- PWA manifest.json

#### Landing Pages
- `/beta-testers` - Tester recruitment
- `/developers` - Developer acquisition
- `/closed-testing-guide` - Educational content

## Performance Optimizations
- Image optimization (WebP/AVIF)
- Static asset caching (1 year)
- DNS prefetching
- Compression enabled
- Security headers configured

## Development

```bash
npm run dev
```

## Deployment

Ready for Vercel deployment. Set all environment variables in Vercel dashboard before deploying.

## Recent Changes (December 7, 2025)
- Comprehensive SEO overhaul with 100+ targeted keywords
- Created SEOHead component with JSON-LD structured data
- Added SEO configuration file with keyword management
- Created landing pages (/beta-testers, /developers, /closed-testing-guide)
- Updated sitemap with proper priorities
- Added PWA manifest.json
- Self-testing prevention (developers can't test own apps)

## Previous Changes (December 6, 2025)
- Admin panel simplified to token-only auth
- Added robots.txt and sitemap.xml
- SEO meta tags added (Open Graph, Twitter Cards)
- Performance optimizations for Vercel
- Security headers configured
- Removed duplicate blog pages
- Created OPTIMIZATION_REPORT.md
