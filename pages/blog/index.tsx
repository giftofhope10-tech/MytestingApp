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
  {
    slug: 'closed-testing-vs-open-testing',
    title: 'Closed Testing vs Open Testing – A Complete Developer Guide',
    excerpt: 'Google Play Console developers ko do major testing options deta hai: Closed Testing aur Open Testing. Is guide me hum in dono ko detail me samjheinge.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'common-app-testing-mistakes',
    title: 'Common App Testing Mistakes – A Complete 1000-Word Developer Guide',
    excerpt: 'App testing ek technical process hi nahi, balke ek mindset hota hai. Is blog me hum sabse common testing mistakes aur unke professional solutions ko explain kareinge.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'app-performance-testing-importance',
    title: 'Why App Performance Testing Is Important – Complete 1000+ Word Guide',
    excerpt: 'App performance testing ensure karti hai ke app har situation me fast, stable aur responsive rahe. Is guide me hum performance testing ko deep me samjheinge.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'network-testing-app-performance',
    title: 'The Importance of Network Testing in App Performance – Full 1000+ Word Guide',
    excerpt: 'Network testing app development ka wo hissa hai jise bohat kam developers seriously lete hain. Is guide me hum network testing ko deep me cover karenge.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'ui-ux-testing-modern-apps',
    title: 'Why UI/UX Testing Matters in Modern App Development – Full 1000+ Word Guide',
    excerpt: 'UI/UX testing modern app development ka wo step hai jise ignore karna almost impossible ho chuka hai. Is guide me hum detail me samjheinge ke UI/UX testing kya hoti hai.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'security-testing-app-development',
    title: 'The Importance of Security Testing in App Development – Full 1000+ Word Guide',
    excerpt: 'Security testing app development ka ek crucial hissa hai jise ignore karna kisi bhi developer ke liye bohot risky ho sakta hai.',
    date: 'December 6, 2025',
    isStatic: true,
  },
  {
    slug: 'compatibility-testing-app-success',
    title: 'Why Compatibility Testing is Critical for App Success – Complete 1000+ Word Guide',
    excerpt: 'Compatibility testing app development ka wo essential step hai jo ensure karta hai ke aapki app har device, har OS, aur har environment me perfect tarike se kaam kare.',
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
