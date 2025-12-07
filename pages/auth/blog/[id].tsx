import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import type { BlogPost } from '../../../lib/types';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [sessionToken, setSessionToken] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('authSessionToken');
    if (!savedToken) {
      router.push('/auth');
      return;
    }
    setSessionToken(savedToken);
    verifySession(savedToken);
  }, [router]);

  const verifySession = async (token: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token }),
      });
      
      if (!res.ok) {
        localStorage.removeItem('authSessionToken');
        router.push('/auth');
      }
    } catch {
      router.push('/auth');
    }
  };

  useEffect(() => {
    if (id && sessionToken) {
      fetchBlog();
    }
  }, [id, sessionToken]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
      const data: BlogPost = await res.json();
      
      if (res.ok) {
        setTitle(data.title);
        setExcerpt(data.excerpt || '');
        setContent(data.content);
        setStatus(data.status);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      setError('Failed to fetch blog post');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      router.push('/auth/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Blog Post - Auth Panel</title>
      </Head>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Link href="/auth/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-xl">🔐</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">Auth Panel</h1>
                    <p className="text-xs text-purple-200">Edit Blog Post</p>
                  </div>
                </Link>
              </div>
              <Link href="/auth/dashboard" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Edit Blog Post</h2>
            <p className="text-slate-500 mt-1">Update your blog post content</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Short description for previews"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-mono text-sm"
                    placeholder="Write your blog content here. You can use basic HTML tags for formatting."
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt; for formatting.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition ${
                      status === 'draft' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === 'draft'}
                        onChange={() => setStatus('draft')}
                        className="sr-only"
                      />
                      <span className="text-xl">📝</span>
                      <span className="font-medium">Draft (Unpublished)</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition ${
                      status === 'published' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === 'published'}
                        onChange={() => setStatus('published')}
                        className="sr-only"
                      />
                      <span className="text-xl">🌐</span>
                      <span className="font-medium">Published</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/auth/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full border border-slate-300 py-3 rounded-xl font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
