import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import OTPVerification from '../components/OTPVerification';
import ProgressBar from '../components/ProgressBar';
import type { App, TesterRequest } from '../lib/types';

export default function TesterDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [requests, setRequests] = useState<TesterRequest[]>([]);
  const [apps, setApps] = useState<Record<string, App>>({});
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [ratingData, setRatingData] = useState<Record<string, { rating: number; feedback: string }>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const requestsRes = await fetch(`/api/tester-requests?testerEmail=${email}`);
      const requestsData = await requestsRes.json();
      if (requestsRes.ok && Array.isArray(requestsData)) {
        setRequests(requestsData);
      } else {
        console.error('Failed to fetch requests:', requestsData?.error || 'Invalid response');
        setRequests([]);
      }

      const appsRes = await fetch('/api/apps');
      const appsData = await appsRes.json();
      const appsMap: Record<string, App> = {};
      if (appsRes.ok && Array.isArray(appsData)) {
        appsData.forEach((app: App) => {
          appsMap[app.appId] = app;
        });
      } else {
        console.error('Failed to fetch apps:', appsData?.error || 'Invalid response');
      }
      setApps(appsMap);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setRequests([]);
      setApps({});
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
      setVerified(true);
      localStorage.setItem('testerEmail', router.query.email as string);
    } else {
      const savedEmail = localStorage.getItem('testerEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setVerified(true);
      }
    }
  }, [router.query]);

  const handleLogout = () => {
    localStorage.removeItem('testerEmail');
    setVerified(false);
    setEmail('');
    setRequests([]);
    setApps({});
  };

  const hasActiveTesting = requests.some(r => r.status === 'approved' && r.daysTested < 14);

  const handleDeleteAccount = async () => {
    if (hasActiveTesting) return;
    
    setDeleting(true);
    try {
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'tester' }),
      });

      if (res.ok) {
        localStorage.removeItem('testerEmail');
        setVerified(false);
        setEmail('');
        setRequests([]);
        setApps({});
        setShowDeleteModal(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (verified && email) {
      fetchData();
    }
  }, [verified, email, fetchData]);

  const checkIn = async (appId: string) => {
    setCheckingIn(appId);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testerEmail: email, appId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage({ type: 'success', text: data.message });
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check in';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setCheckingIn(null);
    }
  };

  const submitRating = async (requestId: string) => {
    const data = ratingData[requestId];
    if (!data?.rating) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }

    try {
      const res = await fetch(`/api/tester-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: data.rating,
          feedback: data.feedback,
          testerEmail: email,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit rating');
      }

      setMessage({ type: 'success', text: 'Rating submitted successfully!' });
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit rating';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const canCheckIn = (request: TesterRequest) => {
    if (request.daysTested >= 14) return false;
    const today = new Date().toISOString().split('T')[0];
    return request.lastTestDate !== today;
  };

  if (!verified) {
    return (
      <Layout title="Tester Dashboard - Close Testing Group">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tester Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Verify your email to access your tester dashboard.
            </p>
            <OTPVerification
              email={email}
              onEmailChange={setEmail}
              onVerified={() => setVerified(true)}
            />
          </div>
        </div>
      </Layout>
    );
  }

  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const completedTests = approvedRequests.filter((r) => r.daysTested >= 14);

  return (
    <Layout title="Tester Dashboard - Close Testing Group">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tester Dashboard</h1>
            <p className="text-gray-500 text-sm sm:text-base truncate">{email}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link href="/" className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base text-center whitespace-nowrap">
              Browse Apps
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base whitespace-nowrap"
            >
              Logout
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={hasActiveTesting}
              className="flex-1 sm:flex-none bg-red-100 text-red-600 px-4 sm:px-6 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base whitespace-nowrap"
              title={hasActiveTesting ? 'Complete all active tests before deleting account' : 'Delete account'}
            >
              Delete Account
            </button>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Account?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete your account and all your test history. You will need to verify your email again to use the platform.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}

        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-3xl font-bold text-indigo-600">{requests.length}</div>
            <div className="text-xs sm:text-base text-gray-500">Total Requests</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-3xl font-bold text-green-600">{approvedRequests.length}</div>
            <div className="text-xs sm:text-base text-gray-500">Active Tests</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6 text-center">
            <div className="text-xl sm:text-3xl font-bold text-yellow-600">{completedTests.length}</div>
            <div className="text-xs sm:text-base text-gray-500">Completed</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">No test requests yet</h3>
            <p className="text-gray-500 mt-1">Browse apps and request to become a tester!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {approvedRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Tests</h2>
                <div className="space-y-4">
                  {approvedRequests.map((request) => {
                    const app = apps[request.appId];
                    if (!app) return null;

                    return (
                      <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
                              <Image src={app.iconUrl} alt={app.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                            ) : (
                              <div className="text-2xl">📱</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                            <p className="text-sm text-gray-500">{app.packageName}</p>
                            {request.completedBadge && (
                              <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                ✓ Completed Reviewer
                              </span>
                            )}
                          </div>
                        </div>

                        <ProgressBar current={request.daysTested} total={14} />

                        <div className="flex gap-4 mt-4">
                          <a
                            href={app.playLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gray-200 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-300 transition"
                          >
                            Open Test Link
                          </a>
                          <button
                            onClick={() => checkIn(request.appId)}
                            disabled={!canCheckIn(request) || checkingIn === request.appId}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                          >
                            {checkingIn === request.appId
                              ? 'Checking in...'
                              : request.daysTested >= 14
                              ? 'Test Complete!'
                              : canCheckIn(request)
                              ? 'I Tested Today ✓'
                              : 'Already checked in today'}
                          </button>
                        </div>

                        {request.daysTested >= 14 && !request.rating && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Leave a Rating</h4>
                            <div className="flex gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRatingData({
                                    ...ratingData,
                                    [request.id]: { ...ratingData[request.id], rating: star }
                                  })}
                                  className={`text-3xl ${
                                    (ratingData[request.id]?.rating || 0) >= star
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <textarea
                              placeholder="Share your feedback about the app..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                              rows={2}
                              value={ratingData[request.id]?.feedback || ''}
                              onChange={(e) => setRatingData({
                                ...ratingData,
                                [request.id]: { ...ratingData[request.id], feedback: e.target.value }
                              })}
                            />
                            <button
                              onClick={() => submitRating(request.id)}
                              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                            >
                              Submit Rating
                            </button>
                          </div>
                        )}

                        {request.rating && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400">{'★'.repeat(request.rating)}</span>
                              <span className="text-gray-400">{'★'.repeat(5 - request.rating)}</span>
                              <span className="text-sm text-gray-600">Your rating</span>
                            </div>
                            {request.feedback && (
                              <p className="text-sm text-gray-600 mt-2">&quot;{request.feedback}&quot;</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h2>
                <div className="space-y-4">
                  {pendingRequests.map((request) => {
                    const app = apps[request.appId];
                    if (!app) return null;

                    return (
                      <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
                              <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                            ) : (
                              <div className="text-xl">📱</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{app.name}</h3>
                            <p className="text-sm text-yellow-600">⏳ Waiting for developer approval</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
