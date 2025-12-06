import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import OTPVerification from '../components/OTPVerification';
import ProgressBar from '../components/ProgressBar';
import type { App, TesterRequest } from '../lib/types';

type TabType = 'developer' | 'tester';

export default function UnifiedDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('developer');
  
  const [myApps, setMyApps] = useState<App[]>([]);
  const [developerRequests, setDeveloperRequests] = useState<TesterRequest[]>([]);
  
  const [testerRequests, setTesterRequests] = useState<TesterRequest[]>([]);
  const [allApps, setAllApps] = useState<Record<string, App>>({});
  
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [ratingData, setRatingData] = useState<Record<string, { rating: number; feedback: string; bugReport: string }>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, devRequestsRes, testerRequestsRes] = await Promise.all([
        fetch('/api/apps'),
        fetch(`/api/tester-requests?developerEmail=${email}`),
        fetch(`/api/tester-requests?testerEmail=${email}`),
      ]);

      const appsData = await appsRes.json();
      const devRequestsData = await devRequestsRes.json();
      const testerRequestsData = await testerRequestsRes.json();

      if (appsRes.ok && Array.isArray(appsData)) {
        const myOwnApps = appsData.filter((app: App) => app.developerEmail === email);
        setMyApps(myOwnApps);
        
        const appsMap: Record<string, App> = {};
        appsData.forEach((app: App) => {
          appsMap[app.appId] = app;
        });
        setAllApps(appsMap);
      } else {
        setMyApps([]);
        setAllApps({});
      }

      if (devRequestsRes.ok && Array.isArray(devRequestsData)) {
        setDeveloperRequests(devRequestsData);
      } else {
        setDeveloperRequests([]);
      }

      if (testerRequestsRes.ok && Array.isArray(testerRequestsData)) {
        setTesterRequests(testerRequestsData);
      } else {
        setTesterRequests([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setMyApps([]);
      setAllApps({});
      setDeveloperRequests([]);
      setTesterRequests([]);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
      setVerified(true);
      localStorage.setItem('userEmail', router.query.email as string);
    } else {
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setVerified(true);
      }
    }
    
    if (router.query.tab === 'tester') {
      setActiveTab('tester');
    }
  }, [router.query]);

  useEffect(() => {
    if (verified && email) {
      fetchData();
    }
  }, [verified, email, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('developerEmail');
    localStorage.removeItem('testerEmail');
    setVerified(false);
    setEmail('');
    setMyApps([]);
    setDeveloperRequests([]);
    setTesterRequests([]);
    setAllApps({});
  };

  const hasActiveApps = myApps.some(app => app.status === 'active');
  const hasActiveTesting = testerRequests.some(r => r.status === 'approved');
  const canDeleteAccount = !hasActiveApps && !hasActiveTesting;

  const handleDeleteAccount = async () => {
    if (!canDeleteAccount) return;
    
    setDeleting(true);
    try {
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'both' }),
      });

      if (res.ok) {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('developerEmail');
        localStorage.removeItem('testerEmail');
        setVerified(false);
        setEmail('');
        setShowDeleteModal(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    setUpdating(requestId);
    try {
      const res = await fetch(`/api/tester-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, developerEmail: email }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update request:', error);
    } finally {
      setUpdating(null);
    }
  };

  const markAppCompleted = async (appId: string) => {
    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', developerEmail: email }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

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
          bugReport: data.bugReport,
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

  const submitBugReport = async (requestId: string) => {
    const data = ratingData[requestId];
    if (!data?.bugReport?.trim()) {
      setMessage({ type: 'error', text: 'Please enter a bug report' });
      return;
    }

    try {
      const res = await fetch(`/api/tester-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugReport: data.bugReport,
          testerEmail: email,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit bug report');
      }

      setMessage({ type: 'success', text: 'Bug report submitted successfully!' });
      fetchData();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit bug report';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const canCheckIn = (request: TesterRequest) => {
    const today = new Date().toISOString().split('T')[0];
    return request.lastTestDate !== today;
  };

  if (!verified) {
    return (
      <Layout title="Dashboard - Close Testing Group">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Verify your email to access your dashboard. You can submit apps as a developer and test other apps as a tester with the same account.
            </p>
            <OTPVerification
              email={email}
              onEmailChange={setEmail}
              onVerified={() => {
                localStorage.setItem('userEmail', email.toLowerCase());
                setVerified(true);
              }}
            />
          </div>
        </div>
      </Layout>
    );
  }

  const approvedTesterRequests = testerRequests.filter((r) => r.status === 'approved');
  const pendingTesterRequests = testerRequests.filter((r) => r.status === 'pending');
  const completedTests = approvedTesterRequests.filter((r) => r.rating);

  return (
    <Layout title="Dashboard - Close Testing Group">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 text-sm sm:text-base truncate">{email}</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base whitespace-nowrap"
            >
              Logout
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={!canDeleteAccount}
              className="flex-1 sm:flex-none bg-red-100 text-red-600 px-4 sm:px-6 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base whitespace-nowrap"
              title={!canDeleteAccount ? 'Complete all active tests and apps before deleting account' : 'Delete account'}
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
                This will permanently delete your account, all your apps, and test history. You will need to verify your email again to use the platform.
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('developer')}
              className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium transition ${
                activeTab === 'developer'
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Developer ({myApps.length} apps)
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium transition ${
                activeTab === 'tester'
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tester ({testerRequests.length} tests)
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : activeTab === 'developer' ? (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => router.push('/submit')}
                  className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
                >
                  Submit New App
                </button>
              </div>

              {myApps.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 sm:p-12 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-lg font-medium text-gray-900">No apps submitted yet</h3>
                  <p className="text-gray-500 mt-1">Submit your first app to get testers!</p>
                </div>
              ) : (
                myApps.map((app) => {
                  const appRequests = developerRequests.filter((r) => r.appId === app.appId);
                  const pendingRequests = appRequests.filter((r) => r.status === 'pending');
                  const approvedRequests = appRequests.filter((r) => r.status === 'approved');

                  return (
                    <div key={app.appId} className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                            {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
                              <Image src={app.iconUrl} alt={app.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                            ) : (
                              <div className="text-xl sm:text-2xl">📱</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{app.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{app.packageName}</p>
                            <span className={`inline-block mt-1 sm:mt-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs ${
                              app.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {app.status === 'active' ? 'Active' : 'Completed'}
                            </span>
                          </div>
                        </div>
                        {app.status === 'active' && (
                          <button
                            onClick={() => markAppCompleted(app.appId)}
                            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-gray-900">{appRequests.length}</div>
                          <div className="text-xs sm:text-sm text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
                          <div className="text-xs sm:text-sm text-gray-500">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-2xl font-bold text-green-600">{approvedRequests.length}</div>
                          <div className="text-xs sm:text-sm text-gray-500">Approved</div>
                        </div>
                      </div>

                      {pendingRequests.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Pending Requests</h4>
                          <div className="space-y-2">
                            {pendingRequests.map((request) => (
                              <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <span className="text-gray-700 text-sm truncate">{request.testerEmail}</span>
                                <div className="flex gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleRequest(request.id, 'approved')}
                                    disabled={updating === request.id}
                                    className="flex-1 sm:flex-none bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 text-xs sm:text-sm"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRequest(request.id, 'rejected')}
                                    disabled={updating === request.id}
                                    className="flex-1 sm:flex-none bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-1 rounded-lg hover:bg-red-700 disabled:opacity-50 text-xs sm:text-sm"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {approvedRequests.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Active Testers</h4>
                          <div className="space-y-3">
                            {approvedRequests.map((request) => (
                              <div key={request.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900 text-sm">{request.testerEmail}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{request.daysTested} days tested</span>
                                    {request.completedBadge && (
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {request.rating && (
                                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-yellow-400">{'★'.repeat(request.rating)}{'☆'.repeat(5 - request.rating)}</span>
                                      <span className="text-sm font-medium">{request.rating}/5</span>
                                    </div>
                                    {request.feedback && (
                                      <p className="text-sm text-gray-600">&quot;{request.feedback}&quot;</p>
                                    )}
                                  </div>
                                )}
                                {request.bugReport && (
                                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-red-500">🐛</span>
                                      <span className="text-sm font-medium text-red-700">Bug Report</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{request.bugReport}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex justify-end">
                <Link href="/" className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
                  Browse Apps to Test
                </Link>
              </div>

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
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
                  <div className="text-xl sm:text-2xl font-bold text-indigo-600">{testerRequests.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Total Requests</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{approvedTesterRequests.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Active Tests</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">{completedTests.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Completed</div>
                </div>
              </div>

              {testerRequests.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 sm:p-12 text-center border border-gray-200">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900">No test requests yet</h3>
                  <p className="text-gray-500 mt-1">Browse apps and request to become a tester!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {approvedTesterRequests.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Tests</h2>
                      <div className="space-y-4">
                        {approvedTesterRequests.map((request) => {
                          const app = allApps[request.appId];
                          if (!app) return null;

                          return (
                            <div key={request.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
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
                                      Completed Reviewer
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-indigo-700 font-medium">Days Tested</span>
                                  <span className="text-lg font-bold text-indigo-600">{request.daysTested}</span>
                                </div>
                              </div>

                              <div className="flex gap-4 mt-4">
                                <a
                                  href={app.playLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gray-200 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                                >
                                  Open Test Link
                                </a>
                                <button
                                  onClick={() => checkIn(request.appId)}
                                  disabled={!canCheckIn(request) || checkingIn === request.appId}
                                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition text-sm"
                                >
                                  {checkingIn === request.appId
                                    ? 'Checking in...'
                                    : canCheckIn(request)
                                    ? 'I Tested Today'
                                    : 'Already checked in'}
                                </button>
                              </div>

                              {!request.bugReport && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <span>🐛</span> Report a Bug
                                  </h4>
                                  <textarea
                                    placeholder="Describe any bugs or issues you found..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                                    rows={3}
                                    value={ratingData[request.id]?.bugReport || ''}
                                    onChange={(e) => setRatingData({
                                      ...ratingData,
                                      [request.id]: { ...ratingData[request.id], bugReport: e.target.value }
                                    })}
                                  />
                                  <button
                                    onClick={() => submitBugReport(request.id)}
                                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                  >
                                    Submit Bug Report
                                  </button>
                                </div>
                              )}

                              {request.bugReport && (
                                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-red-500">🐛</span>
                                    <span className="text-sm font-medium text-red-700">Your Bug Report</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{request.bugReport}</p>
                                </div>
                              )}

                              {!request.rating && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
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
                                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
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

                  {pendingTesterRequests.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h2>
                      <div className="space-y-4">
                        {pendingTesterRequests.map((request) => {
                          const app = allApps[request.appId];
                          if (!app) return null;

                          return (
                            <div key={request.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                                  {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
                                    <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
                                  ) : (
                                    <div className="text-xl">📱</div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">{app.name}</h3>
                                  <p className="text-sm text-yellow-600">Waiting for developer approval</p>
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
          )}
        </div>
      </div>
    </Layout>
  );
}
