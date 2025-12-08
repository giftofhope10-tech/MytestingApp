import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { PAGE_SEO } from '../../lib/seo-config';
import type { BlogPost } from '../../lib/types';

export default function BlogIndex() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formattedBlogs = blogs.map(blog => ({
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    date: blog.publishedAt 
      ? new Date(blog.publishedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : new Date(blog.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
  }));

  return (
    <Layout 
      title={PAGE_SEO.blog.title}
      description={PAGE_SEO.blog.description}
      keywords={PAGE_SEO.blog.keywords}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-600 text-lg">Helpful guides and tutorials for developers and testers</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading blogs...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {formattedBlogs.map((blog) => (
              <Link key={blog.slug} href={`/blog/${blog.slug}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition cursor-pointer">
                  <div className="text-sm text-indigo-600 mb-2">{blog.date}</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{blog.title}</h2>
                  <p className="text-gray-600">{blog.excerpt}</p>
                  <div className="mt-4 text-indigo-600 font-medium">Read more →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
