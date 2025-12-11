import Link from 'next/link';
import Layout from '../../components/Layout';
import { PAGE_SEO } from '../../lib/seo-config';
import type { BlogPost } from '../../lib/types';
import { GetServerSideProps } from 'next';

interface BlogIndexProps {
  blogs: BlogPost[];
}

export const getServerSideProps: GetServerSideProps<BlogIndexProps> = async (context) => {
  try {
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host || 'localhost:5000';
    const baseUrl = `${protocol}://${host}`;
    
    const res = await fetch(`${baseUrl}/api/blog`);
    const blogs: BlogPost[] = res.ok ? await res.json() : [];
    
    return {
      props: {
        blogs: Array.isArray(blogs) ? blogs : [],
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      props: {
        blogs: [],
      },
    };
  }
};

export default function BlogIndex({ blogs }: BlogIndexProps) {
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
      breadcrumbs={[{ name: 'Blog', path: '/blog' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-600 text-lg">Helpful guides and tutorials for developers and testers</p>
        </div>

        {formattedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
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
