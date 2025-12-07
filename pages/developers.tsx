import Layout from '../components/Layout';
import Link from 'next/link';
import { generateHowToSchema } from '../lib/seo-config';

export default function Developers() {
  const howToSchema = generateHowToSchema([
    { name: 'Prepare Your App', text: 'Ensure your Android app is published on Google Play Console with closed testing enabled.' },
    { name: 'Submit Your App', text: 'Go to Close Testing Group and submit your app with the Play Store testing link.' },
    { name: 'Verify Your Email', text: 'Verify your developer email to prove ownership and manage your app.' },
    { name: 'Review Tester Requests', text: 'As testers request to join, review their profiles and approve quality testers.' },
    { name: 'Add Testers to Play Console', text: 'Add approved testers to your closed testing track in Google Play Console.' },
    { name: 'Track Progress', text: 'Monitor tester engagement with the 14-day check-in system and gather feedback.' },
  ], 'How to Get Beta Testers for Your Android App');

  return (
    <Layout 
      title="Find Beta Testers for Your Android App | Developer Platform | Close Testing Group"
      description="Connect with quality beta testers for your Google Play closed testing program. Submit your Android app and find reliable testers to help improve your app before launch."
      keywords={['find beta testers', 'android developer testing', 'closed testing track', 'google play beta', 'app testing platform', 'pre-launch testing']}
      breadcrumbs={[{ name: 'For Developers', path: '/developers' }]}
      structuredData={howToSchema}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            For Android Developers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Find Quality Beta Testers
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with reliable testers to ensure your app is ready for launch on Google Play
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose Close Testing Group?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <p>Verified testers committed to 14-day testing cycles</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <p>Easy tester management and approval workflow</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <p>Track tester engagement with daily check-ins</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
              <p>Meet Google Play's 20+ tester requirement</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
            <p className="text-slate-600">Active Testers</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">14 Days</div>
            <p className="text-slate-600">Testing Commitment</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">Free</div>
            <p className="text-slate-600">Platform Access</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Getting Started</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Submit Your App', desc: 'Add your app with the Google Play closed testing link' },
              { step: 2, title: 'Verify Ownership', desc: 'Confirm your developer email to manage your listing' },
              { step: 3, title: 'Review Requests', desc: 'Accept or decline tester applications as they come in' },
              { step: 4, title: 'Add to Play Console', desc: 'Add approved testers to your closed testing track' },
              { step: 5, title: 'Track Progress', desc: 'Monitor tester activity and gather feedback' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                  <span className="text-slate-500"> - {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200/50 hover:shadow-xl transition-all"
          >
            Submit Your App
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
