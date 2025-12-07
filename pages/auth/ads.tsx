import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import type { SiteSettings } from '../../lib/types';

export default function AdsSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState<SiteSettings>({
    adsEnabled: false,
    adsenseClientId: '',
    adSlots: {
      header: '',
      sidebar: '',
      inArticle: '',
      footer: '',
    },
    updatedAt: Date.now(),
    updatedBy: '',
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('authSessionToken');
    if (!savedToken) {
      router.push('/auth');
      return;
    }
    setSessionToken(savedToken);
    verifyAndLoad(savedToken);
  }, [router]);

  const verifyAndLoad = async (token: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      });

      if (!res.ok) {
        localStorage.removeItem('authSessionToken');
        router.push('/auth');
        return;
      }

      await fetchSettings();
    } catch {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings/ads');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/settings/ads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        await fetchSettings();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authSessionToken');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AdSense Settings - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/auth/dashboard" className="text-xl font-bold text-indigo-600">
                Admin Panel
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">AdSense Settings</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/dashboard" className="text-gray-600 hover:text-indigo-600">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">AdSense Settings</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  Ads are currently:
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  settings.adsEnabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {settings.adsEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Enable Ads</h3>
                  <p className="text-sm text-gray-500">Turn ads on/off across the entire website</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, adsEnabled: !prev.adsEnabled }))}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.adsEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      settings.adsEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AdSense Client ID (Publisher ID)
                </label>
                <input
                  type="text"
                  value={settings.adsenseClientId}
                  onChange={(e) => setSettings(prev => ({ ...prev, adsenseClientId: e.target.value }))}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Find this in your Google AdSense account settings
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ad Slot IDs</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create ad units in your AdSense account and paste the slot IDs here
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Ad Slot
                    </label>
                    <input
                      type="text"
                      value={settings.adSlots.header}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        adSlots: { ...prev.adSlots, header: e.target.value }
                      }))}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sidebar Ad Slot
                    </label>
                    <input
                      type="text"
                      value={settings.adSlots.sidebar}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        adSlots: { ...prev.adSlots, sidebar: e.target.value }
                      }))}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In-Article Ad Slot
                    </label>
                    <input
                      type="text"
                      value={settings.adSlots.inArticle}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        adSlots: { ...prev.adSlots, inArticle: e.target.value }
                      }))}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footer Ad Slot
                    </label>
                    <input
                      type="text"
                      value={settings.adSlots.footer}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        adSlots: { ...prev.adSlots, footer: e.target.value }
                      }))}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Guide</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Go to <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer" className="underline">Google AdSense</a> and sign in</li>
                    <li>Copy your Publisher ID (starts with ca-pub-)</li>
                    <li>Create ad units for each position (header, sidebar, etc.)</li>
                    <li>Copy each ad unit's slot ID and paste above</li>
                    <li>Toggle "Enable Ads" to ON</li>
                    <li>Click Save Settings</li>
                  </ol>
                </div>
              </div>

              {settings.updatedAt && settings.updatedBy && (
                <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                  Last updated: {new Date(settings.updatedAt).toLocaleString()} by {settings.updatedBy}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
                <Link
                  href="/auth/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
