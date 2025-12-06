import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { App } from '../../lib/types';

interface TesterRequest {
  id: string;
  testerEmail: string;
  appId: string;
  status: string;
  createdAt: number;
  daysTested: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState<App[]>([]);
  const [testerRequests, setTesterRequests] = useState<TesterRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'apps' | 'requests'>('apps');

  useEffect(() => {
    const sessionToken = localStorage.getItem('adminSessionToken');
    if (!sessionToken) {
      router.push('/admin/login');
      return;
    }

    verifyAndLoad(sessionToken);
  }, [router]);

  const verifyAndLoad = async (sessionToken: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      });

      if (!res.ok) {
        localStorage.removeItem('adminSessionToken');
        router.push('/admin/login');
        return;
      }

      await Promise.all([fetchApps(), fetchTesterRequests()]);
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      if (Array.isArray(data)) {
        setApps(data);
      }
    } catch (error) {
      console.error('Failed to fetch apps:', error);
    }
  };

  const fetchTesterRequests = async () => {
    try {
      const res = await fetch('/api/tester-requests');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTesterRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const updateAppStatus = async (appId: string, status: 'active' | 'completed') => {
    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setApps(apps.map(app => 
          app.appId === appId ? { ...app, status } : app
        ));
      }
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

  const deleteApp = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;

    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setApps(apps.filter(app => app.appId !== appId));
      }
    } catch (error) {
      console.error('Failed to delete app:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSessionToken');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Close Testing Group</title>
      </Head>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚙️</span>
                </div>
                <div>
                  <h1 className="font-bold text-slate-900">Admin Dashboard</h1>
                  <p className="text-xs text-slate-500">Close Testing Group</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">{apps.length}</div>
              <div className="text-sm text-slate-500 mt-1">Total Apps</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
              <div className="text-3xl font-bold text-green-600">
                {apps.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-slate-500 mt-1">Active Apps</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600">{testerRequests.length}</div>
              <div className="text-sm text-slate-500 mt-1">Tester Requests</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab('apps')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'apps'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Apps ({apps.length})
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'requests'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Tester Requests ({testerRequests.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'apps' ? (
                <div className="space-y-4">
                  {apps.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No apps found</p>
                  ) : (
                    apps.map((app) => (
                      <div
                        key={app.appId}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                            <span className="text-2xl">📱</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{app.name}</h3>
                            <p className="text-sm text-slate-500">{app.packageName}</p>
                            <p className="text-xs text-slate-400">{app.developerEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            app.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.status}
                          </span>
                          <select
                            value={app.status}
                            onChange={(e) => updateAppStatus(app.appId, e.target.value as 'active' | 'completed')}
                            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5"
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button
                            onClick={() => deleteApp(app.appId)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {testerRequests.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No tester requests found</p>
                  ) : (
                    testerRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{request.testerEmail}</p>
                          <p className="text-sm text-slate-500">App ID: {request.appId}</p>
                          <p className="text-xs text-slate-400">
                            Days tested: {request.daysTested} | 
                            Requested: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
