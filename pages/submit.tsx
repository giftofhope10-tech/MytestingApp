import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import OTPVerification from '../components/OTPVerification';

export default function SubmitApp() {
  const router = useRouter();
  const [step, setStep] = useState<'verify' | 'form' | 'promise'>('verify');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    packageName: '',
    playLink: '',
    iconUrl: '',
    description: '',
  });
  const [promiseAccepted, setPromiseAccepted] = useState(false);

  const handleVerified = () => {
    setVerified(true);
    setStep('form');
    localStorage.setItem('userEmail', email.toLowerCase());
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.packageName || !formData.playLink) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setStep('promise');
  };

  const submitApp = async () => {
    if (!promiseAccepted) {
      setError('Please accept the Developer Promise Agreement');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          developerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      router.push(`/dashboard?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit app');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 'verify', label: 'Email', icon: '✉️' },
    { id: 'form', label: 'Details', icon: '📱' },
    { id: 'promise', label: 'Agree', icon: '✓' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <Layout title="Submit App - Close Testing Group">
      <div className="max-w-2xl mx-auto px-2 sm:px-0">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Submit Your App</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Get your app tested by real users</p>
        </div>

        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-10 overflow-x-auto px-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all ${
                step === s.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200/50'
                  : currentStepIndex > i
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <span className="text-sm sm:text-base">{s.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{s.label}</span>
              </div>
              {i < 2 && (
                <div className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 ${currentStepIndex > i ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-8">
          {step === 'verify' && (
            <div className="space-y-5 sm:space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">✉️</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Verify Your Email</h2>
                <p className="text-slate-500 mt-2 text-sm sm:text-base">
                  We&apos;ll send a code to confirm your identity.
                </p>
              </div>
              <OTPVerification
                email={email}
                onEmailChange={setEmail}
                onVerified={handleVerified}
              />
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">App Details</h2>
                <p className="text-slate-500 mt-1 text-sm">Tell us about your application</p>
              </div>
              
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    App Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                    placeholder="My Awesome App"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Package Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.packageName}
                    onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                    placeholder="com.example.myapp"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Google Play Test Link <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.playLink}
                    onChange={(e) => setFormData({ ...formData, playLink: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                    placeholder="https://play.google.com/apps/testing/..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    App Icon URL <span className="text-slate-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.iconUrl}
                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
                    placeholder="https://example.com/icon.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                    Description <span className="text-slate-400 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Tell testers about your app..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 transition-all text-sm sm:text-base"
              >
                Continue →
              </button>
            </form>
          )}

          {step === 'promise' && (
            <div className="space-y-5 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Developer Agreement</h2>
                <p className="text-slate-500 mt-1 text-sm">Review and accept our guidelines</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-base sm:text-lg">📋</span>
                  Developer Promise
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-slate-600 text-xs sm:text-sm">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>I am the legitimate owner/developer of this app.</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>I will respond to tester requests promptly.</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>I will not submit harmful applications.</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>I will provide a working test link.</span>
                  </li>
                </ul>
              </div>

              <label className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-slate-200 rounded-lg sm:rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                <input
                  type="checkbox"
                  checked={promiseAccepted}
                  onChange={(e) => setPromiseAccepted(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium text-xs sm:text-sm">
                  I agree to the Developer Promise Agreement
                </span>
              </label>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-medium hover:bg-slate-200 transition-all text-sm sm:text-base"
                >
                  ← Back
                </button>
                <button
                  onClick={submitApp}
                  disabled={!promiseAccepted || submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                >
                  {submitting ? 'Submitting...' : 'Submit →'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
