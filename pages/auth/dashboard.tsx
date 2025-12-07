import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import type { App, BlogPost } from '../../lib/types';

type TabType = 'dashboard' | 'blog' | 'apps';

export default function AuthDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [apps, setApps] = useState<App[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({ totalApps: 0, activeApps: 0, totalBlogs: 0, publishedBlogs: 0 });

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

      await Promise.all([fetchApps(token), fetchBlogs(token)]);
    } catch {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchApps = async (token: string) => {
    try {
      const res = await fetch('/api/apps?adminView=true', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setApps(data);
        setStats(prev => ({
          ...prev,
          totalApps: data.length,
          activeApps: data.filter((a: App) => a.status === 'active').length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch apps:', error);
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
        setStats(prev => ({
          ...prev,
          totalBlogs: data.length,
          publishedBlogs: data.filter((b: BlogPost) => b.status === 'published').length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
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

  const handleTogglePublish = async (blog: BlogPost) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    
    try {
      const res = await fetch(`/api/blog/${blog.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        fetchBlogs(sessionToken);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update blog');
      }
    } catch (err) {
      alert('Failed to update blog status');
    }
  };

  const handleDeleteApp = async (appId: string, developerEmail: string) => {
    const confirmed = confirm(
      `⚠️ Policy Concern Delete\n\nThis will delete the app and notify the developer.\n\nDeveloper: ${developerEmail}\n\nThe developer will receive a message: "Your app has been removed due to policy concerns. Please contact our support team for more information."\n\nAre you sure you want to proceed?`
    );
    
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ policyDelete: true }),
      });
      
      if (res.ok) {
        setApps(apps.filter(app => app.appId !== appId));
        alert('App deleted successfully. Developer has been notified.');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete app');
      }
    } catch (err) {
      alert('Failed to delete app');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authSessionToken');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Auth Panel Dashboard - Close Testing Group</title>
      </Head>
      <div className="min-h-screen bg-slate-50">
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-base sm:text-xl">🔐</span>
                </div>
                <div>
                  <h1 className="font-bold text-sm sm:text-lg">Auth Panel</h1>
                  <p className="text-xs text-purple-200 hidden sm:block">Close Testing Group</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <nav className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-10 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 min-w-max">
              {(['dashboard', 'blog', 'apps'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-purple-600 border-purple-600 bg-purple-50/50'
                      : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab === 'dashboard' && '📊 Dashboard'}
                  {tab === 'blog' && '📝 Blog'}
                  {tab === 'apps' && '📱 Apps'}
                </button>
              ))}
              <Link href="/auth/ads" className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300 border-b-2 whitespace-nowrap">
                📺 AdSense
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <DashboardTab stats={stats} sessionToken={sessionToken} onRefresh={() => fetchBlogs(sessionToken)} />
          )}
          
          {activeTab === 'blog' && (
            <BlogTab 
              blogs={blogs} 
              onDelete={handleDeleteBlog} 
              onTogglePublish={handleTogglePublish}
            />
          )}
          
          {activeTab === 'apps' && (
            <AppsTab apps={apps} onDelete={handleDeleteApp} />
          )}
        </main>
      </div>
    </>
  );
}

function DashboardTab({ stats, sessionToken, onRefresh }: { stats: { totalApps: number; activeApps: number; totalBlogs: number; publishedBlogs: number }; sessionToken: string; onRefresh: () => void }) {
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleMigrateBlogs = async () => {
    if (!confirm('This will migrate 10 static blog posts to the database. Continue?')) return;
    
    setMigrating(true);
    setMigrateResult(null);
    
    try {
      const res = await fetch('/api/admin/migrate-blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMigrateResult({ success: true, message: data.message });
        onRefresh();
      } else {
        setMigrateResult({ success: false, message: data.error || 'Migration failed' });
      }
    } catch (err) {
      setMigrateResult({ success: false, message: 'Migration failed' });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalApps}</div>
              <div className="text-sm text-slate-500">Total Apps</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.activeApps}</div>
              <div className="text-sm text-slate-500">Active Apps</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalBlogs}</div>
              <div className="text-sm text-slate-500">Total Blogs</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌐</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">{stats.publishedBlogs}</div>
              <div className="text-sm text-slate-500">Published Blogs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/auth/blog/new" className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
            <span className="text-2xl">✍️</span>
            <div>
              <div className="font-medium text-slate-900">Write New Blog</div>
              <div className="text-sm text-slate-500">Create and publish a new blog post</div>
            </div>
          </Link>
          <button 
            onClick={handleMigrateBlogs}
            disabled={migrating}
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition text-left disabled:opacity-50"
          >
            <span className="text-2xl">{migrating ? '⏳' : '📦'}</span>
            <div>
              <div className="font-medium text-slate-900">
                {migrating ? 'Migrating...' : 'Migrate Static Blogs'}
              </div>
              <div className="text-sm text-slate-500">Import 10 static blog posts to database</div>
            </div>
          </button>
        </div>
        {migrateResult && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${migrateResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {migrateResult.message}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogTab({ 
  blogs, 
  onDelete, 
  onTogglePublish 
}: { 
  blogs: BlogPost[]; 
  onDelete: (id: string) => void;
  onTogglePublish: (blog: BlogPost) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Blog Management</h2>
        <Link href="/auth/blog/new">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm sm:text-base">
            <span>+</span> New Blog Post
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-500">
            <span className="text-4xl block mb-4">📝</span>
            <p>No blog posts yet. Create your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 sm:p-6 hover:bg-slate-50 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base break-words">{blog.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-2">
                      {blog.excerpt || 'No excerpt available'}
                    </p>
                    <p className="text-xs text-slate-400">
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:flex-shrink-0">
                    <button
                      onClick={() => onTogglePublish(blog)}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg border transition flex-1 sm:flex-none ${
                        blog.status === 'published'
                          ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link href={`/auth/blog/${blog.id}`} className="flex-1 sm:flex-none">
                      <button className="w-full px-3 py-1.5 text-xs sm:text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition">
                        Edit
                      </button>
                    </Link>
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="flex-1 sm:flex-none">
                      <button className="w-full px-3 py-1.5 text-xs sm:text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                        View
                      </button>
                    </Link>
                    <button 
                      onClick={() => onDelete(blog.id)}
                      className="px-3 py-1.5 text-xs sm:text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition flex-1 sm:flex-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppsTab({ apps, onDelete }: { apps: App[]; onDelete: (appId: string, email: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Apps Management</h2>
        <span className="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
          {apps.length} apps
        </span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-lg sm:text-xl">⚠️</span>
          <div>
            <h4 className="font-medium text-amber-800 text-sm sm:text-base">Policy Concern Deletions</h4>
            <p className="text-xs sm:text-sm text-amber-700 mt-1">
              When you delete an app, the developer will receive this message: <br className="hidden sm:inline" />
              <em>"Your app has been removed due to policy concerns. Please contact our support team for more information."</em>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {apps.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-500">
            <span className="text-4xl block mb-4">📱</span>
            <p>No apps found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {apps.map((app) => (
              <div key={app.appId} className="p-4 sm:p-6 hover:bg-slate-50 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {app.iconUrl ? (
                        <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl sm:text-2xl">📱</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base break-words">{app.name}</h3>
                        <span className={`px-2 py-0.5 sm:py-1 text-xs rounded-full font-medium flex-shrink-0 ${
                          app.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">{app.packageName}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <span>👤</span>
                          <span className="font-medium truncate">{app.developerEmail}</span>
                        </div>
                        {app.playLink && (
                          <a 
                            href={app.playLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline"
                          >
                            View on Play Store →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto sm:flex-shrink-0">
                    <button 
                      onClick={() => onDelete(app.appId, app.developerEmail)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition flex items-center justify-center sm:justify-start gap-2"
                    >
                      <span>🗑️</span>
                      Delete (Policy)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
