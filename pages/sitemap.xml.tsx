import { GetServerSideProps } from 'next';
import { adminDb } from '../lib/firebase-admin';

const SITE_URL = 'https://closetesting.online';

const staticPages = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/beta-testers', priority: '0.9', changefreq: 'weekly' },
  { path: '/developers', priority: '0.9', changefreq: 'weekly' },
  { path: '/closed-testing-guide', priority: '0.9', changefreq: 'weekly' },
  { path: '/submit', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.5', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
  { path: '/dmca', priority: '0.5', changefreq: 'yearly' },
  { path: '/ads-disclosure', priority: '0.5', changefreq: 'yearly' },
];

const staticBlogSlugs = [
  'google-play-closed-testing-guide',
  'android-app-closed-testing-submit',
  'beta-testers-role-guide',
  'closed-testing-vs-open-testing',
  'common-app-testing-mistakes',
  'app-performance-testing-importance',
  'network-testing-app-performance',
  'ui-ux-testing-modern-apps',
  'security-testing-app-development',
  'compatibility-testing-app-success',
];

interface BlogData {
  slug: string;
  updatedAt?: number;
  publishedAt?: number;
  createdAt?: number;
  status?: string;
}

function generateSiteMap(blogs: BlogData[], apps: { appId: string; createdAt?: number }[]) {
  const today = new Date().toISOString().split('T')[0];
  
  const allBlogSlugs = new Set([...staticBlogSlugs]);
  blogs.forEach(blog => {
    if (blog.slug && blog.status === 'published') {
      allBlogSlugs.add(blog.slug);
    }
  });
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${Array.from(allBlogSlugs).map(slug => {
  const blogData = blogs.find(b => b.slug === slug);
  const lastmod = blogData?.updatedAt 
    ? new Date(blogData.updatedAt).toISOString().split('T')[0]
    : today;
  return `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}).join('\n')}
${apps.map(app => {
  const lastmod = app.createdAt 
    ? new Date(app.createdAt).toISOString().split('T')[0]
    : today;
  return `  <url>
    <loc>${SITE_URL}/app/${app.appId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
}).join('\n')}
</urlset>`;
}

function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let blogs: BlogData[] = [];
  let apps: { appId: string; createdAt?: number }[] = [];
  
  try {
    const blogsSnapshot = await adminDb.collection('blogs').get();
    blogsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'published') {
        blogs.push({
          slug: data.slug,
          updatedAt: data.updatedAt,
          publishedAt: data.publishedAt,
          createdAt: data.createdAt,
          status: data.status,
        });
      }
    });
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }
  
  try {
    const appsSnapshot = await adminDb.collection('apps').get();
    appsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'active' || data.status === 'completed') {
        apps.push({
          appId: doc.id,
          createdAt: data.createdAt,
        });
      }
    });
  } catch (error) {
    console.error('Error fetching apps for sitemap:', error);
  }
  
  const sitemap = generateSiteMap(blogs, apps);
  
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
