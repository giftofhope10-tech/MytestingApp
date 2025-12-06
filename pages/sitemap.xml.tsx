import { GetServerSideProps } from 'next';

const SITE_URL = 'https://closetesting.online';

const staticPages = [
  '',
  '/about',
  '/blog',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
  '/dmca',
  '/ads-disclosure',
  '/submit',
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
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === '/blog' ? '0.9' : '0.8'}</priority>
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
