import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthPanel() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('authSessionToken');
    if (savedToken) {
      validateExistingSession(savedToken);
    } else {
      setChecking(false);
    }
  }, []);

  const validateExistingSession = async (token: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      });
      
      if (res.ok) {
        router.push('/auth/dashboard');
      } else {
        localStorage.removeItem('authSessionToken');
        setChecking(false);
      }
    } catch (err) {
      localStorage.removeItem('authSessionToken');
      setChecking(false);
    }
  };

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: adminToken }),
      });

      const data = await res.json();

      if (res.ok && data.sessionToken) {
        localStorage.setItem('authSessionToken', data.sessionToken);
        router.push('/auth/dashboard');
      } else {
        setError(data.error || 'Invalid admin token');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Auth Panel - Close Testing Group</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Auth Panel</h1>
            <p className="text-purple-200">Close Testing Group Admin Access</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleTokenLogin} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
            <div className="mb-6">
              <label htmlFor="adminToken" className="block text-sm font-medium text-purple-200 mb-2">
                Admin Token
              </label>
              <input
                id="adminToken"
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter your admin token"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
                minLength={32}
                maxLength={64}
              />
              <p className="text-xs text-purple-300/70 mt-2">
                Enter the 32-character admin token
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || adminToken.length < 32}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </span>
              ) : (
                'Login to Auth Panel'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-purple-300 hover:text-white transition text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
