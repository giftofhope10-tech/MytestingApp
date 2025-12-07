import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import SEOHead from './SEOHead';
import { AdSenseHeader, AdSenseFooter } from './AdSense';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; path: string }[];
  structuredData?: object;
}

export default function Layout({ 
  children, 
  title,
  description,
  keywords,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
  breadcrumbs,
  structuredData,
}: LayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);
  
  const navLinks = [
    { href: '/', label: 'Apps', icon: '🎯' },
    { href: '/beta-testers', label: 'Testers', icon: '👥' },
    { href: '/developers', label: 'Developers', icon: '💻' },
    { href: '/submit', label: 'Submit', icon: '📤' },
    { href: '/dashboard', label: 'Dashboard', icon: '👤' },
    { href: '/blog', label: 'Blog', icon: '📝' },
    { href: '/about', label: 'About', icon: '📖' },
  ];

  const footerLinks = {
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/cookies', label: 'Cookie Policy' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
    more: [
      { href: '/dmca', label: 'DMCA & Copyright' },
      { href: '/ads-disclosure', label: 'Ads Disclosure' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        type={type}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        noindex={noindex}
        breadcrumbs={breadcrumbs}
        structuredData={structuredData}
      />

      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <Image 
                src="/logo.png" 
                alt="Close Testing Group" 
                width={350} 
                height={100} 
                className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                priority
              />
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href || router.pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {mobileMenuOpen && (
            <>
              <div 
                className="md:hidden fixed inset-0 bg-black/20 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg border-t border-slate-100 z-50">
                <div className="flex flex-col gap-1 p-3">
                  {navLinks.map((link) => {
                    const isActive = router.pathname === link.href || router.pathname.startsWith(link.href + '/');
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-lg">{link.icon}</span>
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdSenseHeader />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-grow">
        {children}
      </main>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdSenseFooter />
      </div>

      <footer className="bg-slate-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <Image 
                src="/logo.png" 
                alt="Close Testing Group" 
                width={200} 
                height={60} 
                className="h-16 w-auto object-contain mb-4 brightness-0 invert"
              />
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional platform for Google Play closed testing programs. Connect developers with quality testers.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">More</h3>
              <ul className="space-y-2">
                {footerLinks.more.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:support@closetesting.online" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Close Testing Group. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>Google Play Closed Testing Platform</span>
                <span className="hidden sm:inline">|</span>
                <a href="mailto:support@closetesting.online" className="hover:text-indigo-400 transition-colors">
                  support@closetesting.online
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
