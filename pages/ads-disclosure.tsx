import Link from 'next/link';
import Layout from '../components/Layout';

export default function AdsDisclosure() {
  return (
    <Layout 
      title="Ads Disclosure | Close Testing"
      description="Advertising disclosure for Close Testing Group platform."
      keywords={['ads', 'disclosure', 'adsense']}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Advertising & AdSense Disclosure</h1>
          <p className="text-gray-500 mb-8">Last updated: December 6, 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Why we show ads</h2>
              <p>We display third-party advertisements to support operating costs and keep content free for readers. Ads help cover hosting, content production, and maintenance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Ad networks we use</h2>
              <p>We work with third-party ad networks such as Google AdSense. These networks may use cookies and other tracking technologies. See our <Link href="/cookies" className="text-indigo-600 hover:text-indigo-700">Cookie Policy</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link> for details.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Affiliate links and sponsorships</h2>
              <p>Some content may include affiliate links or sponsored placements. We will clearly disclose when an article contains sponsored content or affiliate links.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">AdSense policy compliance</h2>
              <p>We follow Google AdSense program policies. Specifically:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not encourage users to click ads.</li>
                <li>We do not click our own ads or request others to click them.</li>
                <li>We avoid placing misleading or accidental-click designs beside ads.</li>
                <li>We ensure the site content complies with AdSense content policies (no adult, illegal, or copyrighted violation content).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How ads are personalized</h2>
              <p>Ads may be personalized based on browsing behavior. You can disable personalized ads in Google Ads Settings: <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">https://adssettings.google.com/</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
              <p>For advertising inquiries or to report an ad-related issue, please contact: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700 font-medium">support@closetesting.online</a></p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
