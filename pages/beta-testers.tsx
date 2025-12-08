import Layout from '../components/Layout';
import Link from 'next/link';
import { generateHowToSchema, PAGE_SEO } from '../lib/seo-config';

export default function BetaTesters() {
  const howToSchema = generateHowToSchema([
    { name: 'Create an Account', text: 'Visit Close Testing Group and verify your email to create a tester account.' },
    { name: 'Browse Available Apps', text: 'Explore the list of Android apps currently seeking beta testers.' },
    { name: 'Request to Join', text: 'Find an app that interests you and submit a request to join its closed testing program.' },
    { name: 'Wait for Approval', text: 'The app developer will review your request and add you to their testing group.' },
    { name: 'Install and Test', text: 'Once approved, install the app via Google Play and begin your 14-day testing journey.' },
    { name: 'Provide Feedback', text: 'Use the app daily and provide valuable feedback to help improve the app before launch.' },
  ], 'How to Become a Google Play Beta Tester');

  return (
    <Layout 
      title={PAGE_SEO.betaTesters.title}
      description={PAGE_SEO.betaTesters.description}
      keywords={PAGE_SEO.betaTesters.keywords}
      breadcrumbs={[{ name: 'Beta Testers', path: '/beta-testers' }]}
      structuredData={howToSchema}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Join Testing Programs
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Become a Beta Tester
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get early access to exciting new Android apps and help developers create better experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Early Access</h2>
            <p className="text-slate-600">Be the first to try new apps before they launch on Google Play Store.</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Direct Impact</h2>
            <p className="text-slate-600">Your feedback directly influences app development and features.</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Build Experience</h2>
            <p className="text-slate-600">Gain valuable experience in app testing and quality assurance.</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Free to Join</h2>
            <p className="text-slate-600">Completely free to participate in any testing program on our platform.</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Browse Apps', desc: 'Explore Android apps looking for beta testers' },
              { step: 2, title: 'Request to Join', desc: 'Submit your request to join a testing program' },
              { step: 3, title: 'Get Approved', desc: 'Developer reviews and approves your request' },
              { step: 4, title: 'Start Testing', desc: 'Install the app and begin your 14-day testing journey' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200/50 hover:shadow-xl transition-all"
          >
            Browse Apps for Testing
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
