import Head from 'next/head';
import { useRouter } from 'next/router';
import { SEO_CONFIG, STRUCTURED_DATA, generateBreadcrumbSchema } from '../lib/seo-config';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; path: string }[];
  structuredData?: object;
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  breadcrumbs,
  structuredData,
}: SEOHeadProps) {
  const router = useRouter();
  const { siteUrl, siteName, defaultTitle, defaultDescription, primaryKeywords } = SEO_CONFIG;
  
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = [...new Set([...keywords, ...primaryKeywords])].slice(0, 15);
  const pageImage = image || `${siteUrl}/logo.png`;
  const canonicalUrl = `${siteUrl}${router.asPath.split('?')[0]}`;
  
  const breadcrumbSchema = breadcrumbs
    ? generateBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        ...breadcrumbs.map(b => ({ name: b.name, url: `${siteUrl}${b.path}` })),
      ])
    : null;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords.join(', ')} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="author" content={author || siteName} />
      <meta name="publisher" content={siteName} />
      <meta name="copyright" content={siteName} />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/webp" href="/favicon.webp" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.webp" />
      <link rel="manifest" href="/manifest.json" />
      
      <meta name="theme-color" content="#4f46e5" />
      <meta name="msapplication-TileColor" content="#4f46e5" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA.organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA.website) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}
