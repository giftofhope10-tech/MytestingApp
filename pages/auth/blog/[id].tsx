import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { BlogPost } from '../../../lib/types';

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-slate-300 rounded-xl bg-white min-h-[500px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
    </div>
  ),
});

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
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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

      setLastSaved(new Date());
      router.push('/auth/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
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
          status: 'draft',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setLastSaved(new Date());
      setStatus('draft');
    } catch (err: any) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Blog Post - Auth Panel</title>
      </Head>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-20 shadow-lg">
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
              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="text-xs text-purple-200">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <Link href="/auth/dashboard" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Edit Blog Post</h2>
            <p className="text-slate-500 mt-1">Update your blog post content with our modern editor</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-medium"
                    placeholder="Enter an engaging blog title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Excerpt / Summary
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Write a compelling summary that will appear in blog previews..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This will appear in blog listing pages and search results
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Content *
                    </label>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('write')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                          activeTab === 'write' 
                            ? 'bg-white text-purple-700 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                          activeTab === 'preview' 
                            ? 'bg-white text-purple-700 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {activeTab === 'write' ? (
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Start writing your blog post... Use the toolbar above to format your content."
                    />
                  ) : (
                    <div className="border border-slate-300 rounded-xl bg-white min-h-[500px] p-6">
                      <div className="prose prose-slate max-w-none">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                          <p className="text-slate-400 italic">Nothing to preview yet. Start writing in the Write tab.</p>
                        )}
                      </div>
                    </div>
                  )}
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
                type="button"
                onClick={handleSaveDraft}
                disabled={loading || !title.trim()}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition border border-slate-200"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
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
