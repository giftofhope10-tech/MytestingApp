import Layout from '../components/Layout';
import Link from 'next/link';

const allPages = {
  main: [
    { href: '/', label: 'Home - Browse Apps', desc: 'Explore apps for beta testing' },
    { href: '/submit', label: 'Submit App', desc: 'Submit your Android app for testing' },
    { href: '/beta-testers', label: 'Become a Beta Tester', desc: 'Join testing programs' },
    { href: '/developers', label: 'For Developers', desc: 'Find testers for your app' },
    { href: '/dashboard', label: 'User Dashboard', desc: 'Manage your account' },
  ],
  guides: [
    { href: '/closed-testing-guide', label: 'Closed Testing Guide', desc: 'Complete guide to Google Play testing' },
    { href: '/blog', label: 'Blog', desc: 'Tips and tutorials for testing' },
    { href: '/faq', label: 'FAQ', desc: 'Frequently asked questions' },
  ],
  company: [
    { href: '/about', label: 'About Us', desc: 'Learn about Close Testing Group' },
    { href: '/contact', label: 'Contact', desc: 'Get in touch with us' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy', desc: 'How we handle your data' },
    { href: '/terms', label: 'Terms of Service', desc: 'Terms and conditions' },
    { href: '/cookies', label: 'Cookie Policy', desc: 'Cookie usage information' },
    { href: '/disclaimer', label: 'Disclaimer', desc: 'Legal disclaimer' },
    { href: '/dmca', label: 'DMCA & Copyright', desc: 'Copyright information' },
    { href: '/ads-disclosure', label: 'Ads Disclosure', desc: 'Advertising disclosure' },
  ],
};

export default function AllPages() {
  return (
    <Layout 
      title="All Pages - Site Directory | Close Testing Group"
      description="Complete directory of all pages on Close Testing Group. Find beta testing guides, developer resources, and more."
      keywords={['sitemap', 'all pages', 'site directory', 'navigation']}
      breadcrumbs={[{ name: 'All Pages', path: '/all-pages' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">All Pages</h1>
          <p className="text-slate-600">Complete directory of all pages on our website</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Main Pages
            </h2>
            <div className="grid gap-3">
              {allPages.main.map((page) => (
                <Link key={page.href} href={page.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition-colors group">
                  <div>
                    <div className="font-medium text-slate-800 group-hover:text-indigo-600">{page.label}</div>
                    <div className="text-sm text-slate-500">{page.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span> Guides & Resources
            </h2>
            <div className="grid gap-3">
              {allPages.guides.map((page) => (
                <Link key={page.href} href={page.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors group">
                  <div>
                    <div className="font-medium text-slate-800 group-hover:text-purple-600">{page.label}</div>
                    <div className="text-sm text-slate-500">{page.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏢</span> Company
            </h2>
            <div className="grid gap-3">
              {allPages.company.map((page) => (
                <Link key={page.href} href={page.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 transition-colors group">
                  <div>
                    <div className="font-medium text-slate-800 group-hover:text-green-600">{page.label}</div>
                    <div className="text-sm text-slate-500">{page.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span> Legal Pages
            </h2>
            <div className="grid gap-3">
              {allPages.legal.map((page) => (
                <Link key={page.href} href={page.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors group">
                  <div>
                    <div className="font-medium text-slate-800 group-hover:text-slate-900">{page.label}</div>
                    <div className="text-sm text-slate-500">{page.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
