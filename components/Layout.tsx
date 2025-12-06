import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Close Testing Group' }: LayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { href: '/', label: 'Apps', icon: '🎯' },
    { href: '/submit', label: 'Submit App', icon: '📤' },
    { href: '/dashboard', label: 'Dashboard', icon: '👤' },
    { href: '/about', label: 'About', icon: '📖' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Professional platform for Google Play closed testing programs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <Image 
                src="/logo.png" 
                alt="Close Testing Group" 
                width={280} 
                height={80} 
                className="h-16 sm:h-20 md:h-24 w-auto object-contain"
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
                const isActive = router.pathname === link.href;
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
                    const isActive = router.pathname === link.href;
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>

      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Close Testing Group" 
                width={240} 
                height={70} 
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-slate-400 text-center">
              <span>Google Play Closed Testing</span>
              <span className="hidden sm:inline">|</span>
              <span>Built for Developers & Testers</span>
              <span className="hidden sm:inline">|</span>
              <a href="mailto:support@closetesting.online" className="hover:text-indigo-600 transition-colors">
                support@closetesting.online
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
