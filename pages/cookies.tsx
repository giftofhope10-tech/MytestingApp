import Layout from '../components/Layout';

export default function CookiePolicy() {
  return (
    <Layout 
      title="Cookies | Close Testing Group"
      description="Cookie policy for Close Testing Group platform."
      keywords={['cookies', 'policy', 'tracking']}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-500 mb-8">Effective date: December 6, 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What are cookies?</h2>
              <p>Cookies are small text files stored on your device that help websites remember your preferences and provide a better experience.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How we use cookies</h2>
              <p>We use cookies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential site functionality (session management)</li>
                <li>Analytics (to measure how the site is used)</li>
                <li>Advertising (to serve relevant ads through third-party networks such as Google AdSense)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-party cookies</h2>
              <p>Third parties (for example Google) may place cookies via our site to provide advertising and analytics services. We do not control these cookies — review those providers&apos; policies for details.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Managing cookies</h2>
              <p>You can control cookies through your browser settings. To disable advertising cookies, visit the <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">Google Ads Settings</a> page and opt out of personalized ads.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Changes to this policy</h2>
              <p>We may update this policy. The effective date above will change when we do.</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
