import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import type { BlogPost } from '../../lib/types';

const staticBlogContent: Record<string, { title: string; content: string; date: string }> = {
  'google-play-closed-testing-guide': {
    title: 'Google Play Closed Testing Kya Hota Hai? (Complete Guide)',
    date: 'December 6, 2025',
    content: `
      <h2>Introduction</h2>
      <p>Jab aap ek Android developer hote hain, to aap chahte hain ke aapki app public launch se pehle mukammal tarah se test ho. Google Play Console mein "Closed Testing" ek aisa feature hai jo aapko limited users ke saath app ko test karne ki ijazat deta hai.</p>
      
      <h2>Closed Testing Kya Hai?</h2>
      <p>Closed Testing ek private testing track hai jahan aap specific users ko invite kar sakte hain apni app test karne ke liye. Yeh users aapki app ka feedback de sakte hain before it goes live for everyone.</p>
      
      <h2>Closed Testing Ke Fayde</h2>
      <ul>
        <li>Real users se feedback milta hai</li>
        <li>Bugs aur issues pehle hi identify ho jate hain</li>
        <li>App ki quality improve hoti hai</li>
        <li>Google Play ke 20 testers ka requirement fulfill hota hai</li>
      </ul>
      
      <h2>Kaise Start Karein?</h2>
      <p>Google Play Console mein jayen, apni app select karein, aur Release > Testing > Closed Testing section mein jayein. Wahan se aap new track create kar sakte hain aur testers ko invite kar sakte hain.</p>
    `,
  },
  'android-app-closed-testing-submit': {
    title: 'Android App ko Google Play Closed Testing me Kaise Submit Karein?',
    date: 'December 6, 2025',
    content: `
      <h2>Step-by-Step Guide</h2>
      <p>Yeh article un developers ke liye hai jo apni Android app ko Google Play par closed testing ke zariye distribute karna chahte hain.</p>
      
      <h2>Step 1: Google Play Console Access</h2>
      <p>Sabse pehle Google Play Console (play.google.com/console) par jayein aur apna developer account se login karein.</p>
      
      <h2>Step 2: App Create Karein</h2>
      <p>Agar aapne abhi tak app nahi banai, to "Create app" button par click karein aur basic details fill karein.</p>
      
      <h2>Step 3: Closed Testing Track Setup</h2>
      <p>Release > Testing > Closed testing section mein jayein. "Create track" par click karein aur apni track ka naam dein.</p>
      
      <h2>Step 4: Testers Add Karein</h2>
      <p>Email list ya Google Groups ke zariye testers add karein. Minimum 20 testers chahiye production release ke liye.</p>
      
      <h2>Step 5: APK/AAB Upload Karein</h2>
      <p>Apna signed APK ya AAB file upload karein aur release notes likhein.</p>
    `,
  },
  'beta-testers-role-guide': {
    title: 'Beta Testers Ka Role Kya Hota Hai? Aur Acha Tester Kaise Banein?',
    date: 'December 6, 2025',
    content: `
      <h2>Beta Testing Ki Ahmiyat</h2>
      <p>Beta testing ek ahem stage hai jahan real users app ko use karke problems identify karte hain. Developers ke liye yeh bahut zaroori hai.</p>
      
      <h2>Beta Tester Ka Role</h2>
      <ul>
        <li>App ko daily use karna</li>
        <li>Bugs aur crashes report karna</li>
        <li>Honest feedback dena</li>
        <li>Testing period complete karna</li>
      </ul>
      
      <h2>Acha Tester Kaise Banein?</h2>
      <p>Ek acha beta tester woh hai jo:</p>
      <ul>
        <li>Regular testing karta hai</li>
        <li>Detailed bug reports likhta hai</li>
        <li>Screenshots aur steps provide karta hai</li>
        <li>Constructive feedback deta hai</li>
      </ul>
      
      <h2>Testing Tips</h2>
      <p>Har feature ko test karein, different scenarios try karein, aur jab bhi koi issue mile immediately report karein with proper details.</p>
    `,
  },
};

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    if (staticBlogContent[slug as string]) {
      setIsStatic(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      }
    } catch (err) {
      console.error('Failed to fetch blog:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Loading... - Blog">
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (isStatic && staticBlogContent[slug as string]) {
    const staticPost = staticBlogContent[slug as string];
    return (
      <Layout title={`${staticPost.title} - Blog`}>
        <article className="max-w-3xl mx-auto">
          <Link href="/blog">
            <span className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
              ← Back to Blog
            </span>
          </Link>
          
          <header className="mb-8">
            <p className="text-indigo-600 mb-2">{staticPost.date}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {staticPost.title}
            </h1>
          </header>
          
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: staticPost.content }}
          />
        </article>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout title="Blog Not Found">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <span className="text-indigo-600 hover:text-indigo-800">
              ← Back to Blog
            </span>
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date(blog.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  return (
    <Layout title={`${blog.title} - Blog`}>
      <article className="max-w-3xl mx-auto">
        <Link href="/blog">
          <span className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
            ← Back to Blog
          </span>
        </Link>
        
        <header className="mb-8">
          <p className="text-indigo-600 mb-2">{formattedDate}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-xl text-gray-600">{blog.excerpt}</p>
          )}
        </header>
        
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </Layout>
  );
}
