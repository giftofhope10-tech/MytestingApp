import { useState } from 'react';
import Layout from '../components/Layout';
import AppCard from '../components/AppCard';
import Link from 'next/link';
import type { App, BlogPost } from '../lib/types';
import { PAGE_SEO, generateHowToSchema } from '../lib/seo-config';
import { GetServerSideProps } from 'next';

interface HomeProps {
  apps: App[];
  recentBlogs: BlogPost[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  try {
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host || 'localhost:5000';
    const baseUrl = `${protocol}://${host}`;
    
    const [appsRes, blogsRes] = await Promise.all([
      fetch(`${baseUrl}/api/apps`),
      fetch(`${baseUrl}/api/blog`)
    ]);
    
    const apps: App[] = appsRes.ok ? await appsRes.json() : [];
    const allBlogs: BlogPost[] = blogsRes.ok ? await blogsRes.json() : [];
    
    const recentBlogs = allBlogs
      .filter(blog => blog.status === 'published')
      .sort((a, b) => (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt))
      .slice(0, 5);
    
    return {
      props: {
        apps: Array.isArray(apps) ? apps : [],
        recentBlogs,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        apps: [],
        recentBlogs: [],
      },
    };
  }
};

export default function Home({ apps, recentBlogs }: HomeProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredApps = apps.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: apps.length,
    active: apps.filter(a => a.status === 'active').length,
    completed: apps.filter(a => a.status === 'completed').length,
  };

  const howToSchema = generateHowToSchema([
    { name: 'Browse Apps', text: 'Explore the list of Android apps looking for beta testers on our platform.' },
    { name: 'Choose an App', text: 'Select an app that interests you and click to view its details.' },
    { name: 'Request to Join', text: 'Submit a request to join the closed testing program for that app.' },
    { name: 'Get Approved', text: 'Wait for the developer to approve your request to become a tester.' },
    { name: 'Start Testing', text: 'Install the app and begin your 14-day testing journey, providing valuable feedback.' },
  ], 'How to Join a Google Play Closed Testing Program');

  return (
    <Layout 
      title={PAGE_SEO.home.title}
      description={PAGE_SEO.home.description}
      keywords={PAGE_SEO.home.keywords}
      structuredData={howToSchema}
    >
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

        {filteredApps.length === 0 ? (
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

        {/* See All Pages Link */}
        <div className="flex justify-center mt-6">
          <Link
            href="/all-pages"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 bg-white/70 hover:bg-indigo-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            See All Pages
          </Link>
        </div>

        {/* Recent Blog Posts Section */}
        {recentBlogs.length > 0 && (
          <div className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Blog Posts</h2>
              <Link 
                href="/blog" 
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="block bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{blog.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
