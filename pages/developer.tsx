import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import OTPVerification from '../components/OTPVerification';
import ProgressBar from '../components/ProgressBar';
import type { App, TesterRequest } from '../lib/types';

export default function DeveloperDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [requests, setRequests] = useState<TesterRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, requestsRes] = await Promise.all([
        fetch('/api/apps'),
        fetch(`/api/tester-requests?developerEmail=${email}`),
      ]);

      const appsData = await appsRes.json();
      const requestsData = await requestsRes.json();

      const myApps = appsData.filter((app: App) => app.developerEmail === email);
      setApps(myApps);
      setRequests(requestsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
      setVerified(true);
    }
  }, [router.query]);

  useEffect(() => {
    if (verified && email) {
      fetchData();
    }
  }, [verified, email, fetchData]);

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

  if (!verified) {
    return (
      <Layout title="Developer Dashboard - Close Testing Group">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Developer Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Verify your email to access your developer dashboard.
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

  return (
    <Layout title="Developer Dashboard - Close Testing Group">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-500">{email}</p>
          </div>
          <button
            onClick={() => router.push('/submit')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit New App
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : apps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900">No apps submitted yet</h3>
            <p className="text-gray-500 mt-1">Submit your first app to get started!</p>
          </div>
        ) : (
          apps.map((app) => {
            const appRequests = requests.filter((r) => r.appId === app.appId);
            const pendingRequests = appRequests.filter((r) => r.status === 'pending');
            const approvedRequests = appRequests.filter((r) => r.status === 'approved');

            return (
              <div key={app.appId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {app.iconUrl && app.iconUrl !== '/default-icon.png' ? (
                        <Image src={app.iconUrl} alt={app.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <div className="text-2xl">📱</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500">{app.packageName}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                        app.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {app.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                  </div>
                  {app.status === 'active' && (
                    <button
                      onClick={() => markAppCompleted(app.appId)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{appRequests.length}</div>
                    <div className="text-sm text-gray-500">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
                    <div className="text-sm text-gray-500">Approved</div>
                  </div>
                </div>

                {pendingRequests.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Pending Requests</h4>
                    <div className="space-y-2">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <span className="text-gray-700">{request.testerEmail}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRequest(request.id, 'approved')}
                              disabled={updating === request.id}
                              className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequest(request.id, 'rejected')}
                              disabled={updating === request.id}
                              className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
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
                        <div key={request.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{request.testerEmail}</span>
                            {request.completedBadge && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                Completed
                              </span>
                            )}
                          </div>
                          <ProgressBar current={request.daysTested} total={14} />
                          {request.rating && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm font-medium">{request.rating}/5</span>
                              {request.feedback && (
                                <span className="text-sm text-gray-500">- &quot;{request.feedback}&quot;</span>
                              )}
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
    </Layout>
  );
}
