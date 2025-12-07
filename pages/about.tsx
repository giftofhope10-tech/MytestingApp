import Layout from '../components/Layout';
import Link from 'next/link';
import { PAGE_SEO } from '../lib/seo-config';

export default function About() {
  return (
    <Layout 
      title={PAGE_SEO.about.title}
      description={PAGE_SEO.about.description}
      keywords={PAGE_SEO.about.keywords}
      breadcrumbs={[{ name: 'About', path: '/about' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            About Close Testing Group
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your trusted platform for managing Google Play closed testing programs
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Close Testing Group was created to bridge the gap between Android developers and quality testers. 
              We provide a streamlined platform that makes it easy for developers to find reliable testers for 
              their Google Play closed testing programs, while giving testers access to exciting new apps before 
              they launch publicly.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              How It Works
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-700">For Developers</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">1.</span>
                    <span>Submit your app with Play Store testing link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">2.</span>
                    <span>Verify your email to prove ownership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">3.</span>
                    <span>Review and approve tester requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-1">4.</span>
                    <span>Track tester engagement with 14-day check-ins</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">For Testers</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">1.</span>
                    <span>Browse available apps for testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">2.</span>
                    <span>Request to join testing programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">3.</span>
                    <span>Complete daily check-ins for 14 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">4.</span>
                    <span>Rate apps and help developers improve</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">🔒</span>
              Security & Trust
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We take security seriously. All users must verify their email addresses through our OTP 
              verification system. We block temporary and disposable email addresses to ensure only 
              genuine users participate in testing programs.
            </p>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-indigo-700 text-sm">
                <strong>Note:</strong> Verification emails are sent from <span className="font-mono">idverify@closetesting.online</span>. 
                Please check your spam folder if you don't receive the code.
              </p>
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="text-3xl">📧</span>
              Contact Us
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Have questions, feedback, or need assistance? We're here to help!
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a 
                href="mailto:support@closetesting.online" 
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-indigo-700">General Support</div>
                  <div className="text-sm text-slate-500">support@closetesting.online</div>
                </div>
              </a>
              <a 
                href="mailto:idverify@closetesting.online" 
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-purple-700">Verification Issues</div>
                  <div className="text-sm text-slate-500">idverify@closetesting.online</div>
                </div>
              </a>
            </div>
          </section>

          <div className="text-center pt-8">
            <p className="text-slate-500 mb-6">Ready to get started?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/submit" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                <span>📤</span>
                Submit Your App
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 transition-all"
              >
                <span>🎯</span>
                Browse Apps
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
