import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import OTPVerification from '../../components/OTPVerification';
import type { BlogPost } from '../../lib/types';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');

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
      const res = await fetch('/api/admin/session', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email);
        setAdminRole(data.role);
        setSessionToken(token);
        setIsAdmin(true);
        setVerified(true);
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

  const createSession = async (userEmail: string) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        setSessionToken(data.token);
        setAdminRole(data.role);
        setEmail(data.email);
        setIsAdmin(true);
        setVerified(true);
        localStorage.setItem('adminSessionToken', data.token);
        fetchBlogs(data.token);
      } else {
        setError(data.error || 'You are not authorized to access the admin panel');
        setIsAdmin(false);
      }
    } catch (err) {
      setError('Failed to create session');
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

  const handleVerified = () => {
    createSession(email);
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
    try {
      await fetch('/api/admin/session', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('adminSessionToken');
    setEmail('');
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
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <OTPVerification
            email={email}
            onEmailChange={setEmail}
            onVerified={handleVerified}
          />
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
              Logged in as: {email} ({adminRole})
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

        {adminRole === 'admin' && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Management</h2>
            <p className="text-gray-600 mb-4">
              As a super admin, you can add new editors to manage blog content.
            </p>
            <Link href="/admin/users">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
                Manage Admins
              </button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
