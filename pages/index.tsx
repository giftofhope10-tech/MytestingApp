import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AppCard from '../components/AppCard';
import Link from 'next/link';
import type { App } from '../lib/types';

export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/apps');
      const data = await res.json();
      setApps(data);
    } catch (error) {
      console.error('Failed to fetch apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = apps.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: apps.length,
    active: apps.filter(a => a.status === 'active').length,
    completed: apps.filter(a => a.status === 'completed').length,
  };

  return (
    <Layout title="Close Testing Group - Home">
      <div className="space-y-6 sm:space-y-10">
        <div className="text-center space-y-3 sm:space-y-4 px-2">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 rounded-full text-indigo-600 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Beta Testing Platform
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Google Play{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Closed Testing
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Join exclusive beta programs or submit your app for testing. 
            Get real feedback from real testers.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-slate-100 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Total Apps</div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-slate-100 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Active</div>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-slate-100 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-slate-400">{stats.completed}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Completed</div>
          </div>
        </div>

        <div className="flex justify-center px-2">
          <div className="inline-flex items-center gap-1 p-1 sm:p-1.5 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto max-w-md">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200/50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-block">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-500 text-sm sm:text-base">Loading apps...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm mx-2 sm:mx-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl">📱</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">No apps found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm sm:text-base px-4">
              {filter === 'all'
                ? 'Be the first to submit an app for testing!'
                : `No ${filter} apps at the moment.`}
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 transition-all duration-300 text-sm sm:text-base"
            >
              <span>Submit Your App</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app) => (
              <AppCard key={app.appId} app={app} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
