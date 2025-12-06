import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const sessionToken = localStorage.getItem('adminSessionToken');
    if (sessionToken) {
      verifySession(sessionToken);
    } else {
      setChecking(false);
    }
  }, []);

  const verifySession = async (sessionToken: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        localStorage.removeItem('adminSessionToken');
        setChecking(false);
      }
    } catch {
      setChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminSessionToken', data.sessionToken);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login - Close Testing Group</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
              <p className="text-slate-500 mt-2">Enter your admin token to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Token
                </label>
                <input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your 32-character token"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  minLength={32}
                  maxLength={64}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || token.length < 32}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Authenticating...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
