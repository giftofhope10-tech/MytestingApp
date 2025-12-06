import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function AdminUsers() {
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'editor'>('editor');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('adminSessionToken');
    if (!savedToken) {
      router.push('/admin');
      return;
    }
    setSessionToken(savedToken);
    checkAdminRole(savedToken);
  }, [router]);

  const checkAdminRole = async (token: string) => {
    try {
      const res = await fetch('/api/admin/session', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (!res.ok || data.role !== 'admin') {
        router.push('/admin');
        return;
      }
      setAdminRole(data.role);
    } catch (err) {
      router.push('/admin');
    } finally {
      setChecking(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          email: newAdminEmail,
          role: newAdminRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSuccess('Admin added successfully!');
      setNewAdminEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  if (checking || adminRole !== 'admin') {
    return (
      <Layout title="Admin Management">
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Management - Close Testing Group">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <button 
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Admin
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Admin</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'editor')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="editor">Editor (can manage blog posts)</option>
                <option value="admin">Super Admin (can manage admins)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Admin'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>- Editors can create, edit, and delete blog posts</li>
            <li>- Super Admins can also add or remove other admins</li>
            <li>- New admins will need to verify their email to access the panel</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
