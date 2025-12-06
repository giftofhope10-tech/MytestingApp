import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import type { BlogPost } from '../../lib/types';

export default function AdminPanel() {
  const [verified, setVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminSessionToken');
    if (savedToken) {
      validateExistingSession(savedToken);
    } else {
      setLoading(false);
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
        setSessionToken(token);
        setIsAdmin(true);
        setVerified(true);
        setAdminRole('admin');
        fetchBlogs(token);
      } else {
        localStorage.removeItem('adminSessionToken');
      }
    } catch (err) {
      localStorage.removeItem('adminSessionToken');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async (token: string) => {
    try {
      const res = await fetch('/api/blog?adminView=true', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: adminToken }),
      });

      const data = await res.json();

      if (res.ok && data.sessionToken) {
        localStorage.setItem('adminSessionToken', data.sessionToken);
        setSessionToken(data.sessionToken);
        setIsAdmin(true);
        setVerified(true);
        setAdminRole('admin');
        fetchBlogs(data.sessionToken);
      } else {
        setError(data.error || 'Invalid admin token');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setTokenLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const res = await fetch(`/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      if (res.ok) {
        fetchBlogs(sessionToken);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('adminSessionToken');
    setVerified(false);
    setIsAdmin(false);
    setSessionToken('');
    setBlogs([]);
  };

  if (loading) {
    return (
      <Layout title="Admin Panel - Close Testing Group">
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!verified || !isAdmin) {
    return (
      <Layout title="Admin Panel - Close Testing Group">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-2">Enter your admin token to continue</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleTokenLogin} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-4">
              <label htmlFor="adminToken" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Token
              </label>
              <input
                id="adminToken"
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter your admin token"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                minLength={32}
                maxLength={64}
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the 32-character admin token
              </p>
            </div>
            <button
              type="submit"
              disabled={tokenLoading || adminToken.length < 32}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {tokenLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Panel - Close Testing Group">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">
              Logged in as: Admin
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/blog/new">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                + New Blog Post
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Blog Posts</h2>
          </div>
          
          {blogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No blog posts yet. Create your first one!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900">{blog.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {blog.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {blog.excerpt?.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/blog/${blog.id}`}>
                      <button className="text-indigo-600 hover:text-indigo-800 px-3 py-1 text-sm border border-indigo-200 rounded-lg hover:bg-indigo-50">
                        Edit
                      </button>
                    </Link>
                    <Link href={`/blog/${blog.slug}`} target="_blank">
                      <button className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                        View
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Management</h2>
          <p className="text-gray-600 mb-4">
            Manage admin users and permissions.
          </p>
          <Link href="/admin/users">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
              Manage Admins
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
