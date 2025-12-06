import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import OTPVerification from '../../components/OTPVerification';
import ProgressBar from '../../components/ProgressBar';
import type { App, TesterRequest } from '../../lib/types';

export default function AppDetails() {
  const router = useRouter();
  const { appId } = router.query;

  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [testerRequest, setTesterRequest] = useState<TesterRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchApp = useCallback(async () => {
    try {
      const res = await fetch(`/api/apps/${appId}`);
      const data = await res.json();
      if (res.ok) {
        setApp(data);
      }
    } catch (error) {
      console.error('Failed to fetch app:', error);
    } finally {
      setLoading(false);
    }
  }, [appId]);

  const checkTesterRequest = useCallback(async () => {
    try {
      const res = await fetch(`/api/tester-requests?testerEmail=${email}&appId=${appId}`);
      const data = await res.json();
      const request = data.find((r: TesterRequest) => r.appId === appId);
      if (request) {
        setTesterRequest(request);
      }
    } catch (error) {
      console.error('Failed to check request:', error);
    }
  }, [email, appId]);

  useEffect(() => {
    if (appId) {
      fetchApp();
    }
  }, [appId, fetchApp]);

  useEffect(() => {
    if (verified && email && appId) {
      checkTesterRequest();
    }
  }, [verified, email, appId, checkTesterRequest]);

  const requestAccess = async () => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/tester-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testerEmail: email, appId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage({ type: 'success', text: 'Request submitted! Wait for approval.' });
      checkTesterRequest();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12 sm:py-16">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm sm:text-base">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!app) {
    return (
      <Layout>
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">🔍</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">App not found</h2>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">This app may have been removed.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${app.name} - Close Testing Group`}>
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
                <Image src={app.iconUrl} alt={app.name} width={96} height={96} className="w-full h-full object-cover" unoptimized />
              ) : (
                <span className="text-3xl sm:text-5xl">📱</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{app.name}</h1>
              <p className="text-slate-400 mt-0.5 sm:mt-1 truncate text-xs sm:text-base">{app.packageName}</p>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <span className="text-amber-500 text-sm sm:text-lg">★</span>
                  <span className="font-semibold text-amber-700 text-sm sm:text-base">
                    {app.rating > 0 ? app.rating.toFixed(1) : '-'}
                  </span>
                </div>
                <span className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
                  app.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}>
                  {app.status === 'active' ? '● Active' : 'Completed'}
                </span>
              </div>
            </div>
          </div>

          {app.description && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{app.description}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-base sm:text-lg">🧪</span>
            Request Access
          </h2>

          {!verified ? (
            <div className="space-y-4">
              <p className="text-slate-500 text-sm sm:text-base">
                Verify your email to request testing access.
              </p>
              <OTPVerification
                email={email}
                onEmailChange={setEmail}
                onVerified={() => setVerified(true)}
              />
            </div>
          ) : testerRequest ? (
            <div className="space-y-4 sm:space-y-5">
              <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 ${
                testerRequest.status === 'approved'
                  ? 'bg-emerald-50 border border-emerald-100'
                  : testerRequest.status === 'rejected'
                  ? 'bg-red-50 border border-red-100'
                  : 'bg-amber-50 border border-amber-100'
              }`}>
                <span className="text-xl sm:text-2xl">
                  {testerRequest.status === 'approved' && '✅'}
                  {testerRequest.status === 'rejected' && '❌'}
                  {testerRequest.status === 'pending' && '⏳'}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">
                    {testerRequest.status === 'approved' && 'Access Approved!'}
                    {testerRequest.status === 'rejected' && 'Access Rejected'}
                    {testerRequest.status === 'pending' && 'Waiting for Approval'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {testerRequest.status === 'approved' && 'You can now test this app'}
                    {testerRequest.status === 'rejected' && 'Developer declined your request'}
                    {testerRequest.status === 'pending' && 'Developer will review soon'}
                  </p>
                </div>
              </div>

              {testerRequest.status === 'approved' && (
                <>
                  <a
                    href={app.playLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 transition-all text-sm sm:text-base"
                  >
                    Open Play Store →
                  </a>

                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                    <ProgressBar current={testerRequest.daysTested} total={14} />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 text-center">
                    Visit your{' '}
                    <a href={`/tester?email=${email}`} className="text-indigo-600 font-medium hover:underline">
                      Tester Dashboard
                    </a>{' '}
                    for daily check-in.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                <span className="text-base sm:text-lg">✉️</span>
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400">Verified as</p>
                  <p className="font-medium text-slate-700 text-sm sm:text-base">{email}</p>
                </div>
              </div>
              <button
                onClick={requestAccess}
                disabled={submitting || app.status !== 'active'}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              >
                {submitting ? 'Submitting...' : 'Request Access →'}
              </button>
              {app.status !== 'active' && (
                <p className="text-xs sm:text-sm text-slate-500 text-center">
                  Testing has completed for this app.
                </p>
              )}
            </div>
          )}

          {message.text && (
            <div className={`mt-4 sm:mt-5 p-3 sm:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
