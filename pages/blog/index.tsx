import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import type { BlogPost } from '../../lib/types';

const staticBlogs = [
  {
    slug: 'google-play-closed-testing-guide',
    title: 'Google Play Closed Testing Kya Hota Hai? (Complete Guide)',
    excerpt: 'Jab aap ek Android developer hote hain, to aap chahte hain ke aapki app public launch se pehle mukammal tarah se test ho. Is guide mein hum step-by-step samjhayenge ke Closed Testing kya hai.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'android-app-closed-testing-submit',
    title: 'Android App ko Google Play Closed Testing me Kaise Submit Karein?',
    excerpt: 'Yeh article un developers ke liye hai jo apni Android app ko Google Play par closed testing ke zariye distribute karna chahte hain. Main har step asaan aur practical language me bataunga.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'beta-testers-role-guide',
    title: 'Beta Testers Ka Role Kya Hota Hai? Aur Acha Tester Kaise Banein?',
    excerpt: 'Beta testing ek ahem stage hai jahan real users app ko use karke problems identify karte hain. Is blog me hum detail se dekhenge ke beta tester ka role kya hota hai.',
    date: 'December 6, 2025',
    isStatic: true,
  },
];

export default function BlogIndex() {
  const [dynamicBlogs, setDynamicBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setDynamicBlogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const allBlogs = [
    ...dynamicBlogs.map(blog => ({
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
      isStatic: false,
    })),
    ...staticBlogs,
  ];

  return (
    <Layout title="Blog - Close Testing Group">
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
            {allBlogs.map((blog) => (
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
