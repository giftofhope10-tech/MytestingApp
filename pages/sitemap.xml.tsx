import { GetServerSideProps } from 'next';

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

const blogSlugs = [
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

function generateSiteMap() {
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${blogSlugs.map(slug => `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;
}

function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap();
  
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
