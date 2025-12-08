import Layout from '../components/Layout';
import { PAGE_SEO } from '../lib/seo-config';

export default function PrivacyPolicy() {
  return (
    <Layout 
      title={PAGE_SEO.privacy.title}
      description={PAGE_SEO.privacy.description}
      keywords={PAGE_SEO.privacy.keywords}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: December 6, 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Introduction</h2>
              <p>Your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and your choices. By using our website you agree to the terms in this policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information we collect</h2>
              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">1. Information you provide</h3>
              <p>We only collect personal information that you voluntarily submit, for example via our contact form or when you comment. Typical information includes your name and email address. You can choose not to provide personal information, but some features may not be available.</p>
              
              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2. Automatically collected information</h3>
              <p>When you visit the site we automatically collect non-personal technical information such as your IP address (general), browser type, device type, pages viewed, referrer URL, and timestamps. This helps us understand usage patterns and improve the site.</p>
              
              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3. Cookies and tracking</h3>
              <p>We use cookies and similar technologies for site functionality, analytics, and advertising. Cookies may store preferences, session information, and identifiers used by third-party services such as Google Analytics and Google AdSense.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How we use information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To operate and maintain the website.</li>
                <li>To respond to user inquiries and support requests.</li>
                <li>To analyze site performance and improve content.</li>
                <li>To serve advertising (see our Advertising Disclosure).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-party services</h2>
              <p>We use trusted third-party services for analytics and advertising, for example Google Analytics and Google AdSense. These services may collect information about your visit and may use cookies. We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your rights and choices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access & correction:</strong> You can contact us to request correction or deletion of personal data you submitted.</li>
                <li><strong>Cookies:</strong> You can control or disable cookies via your browser settings, but disabling cookies may affect site functionality.</li>
                <li><strong>Do Not Track:</strong> Our site does not currently respond to Do Not Track (DNT) signals but you can control tracking via browser settings and ad preferences.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data security</h2>
              <p>We use reasonable administrative and technical safeguards to protect information. However, no system is completely secure — we cannot guarantee absolute protection.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Children&apos;s privacy</h2>
              <p>This website is not directed to children under 13 and we do not knowingly collect personal information from children. If you believe a child has submitted data, contact us and we will remove it.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
              <p>If you have questions about this Privacy Policy, contact us at: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700">support@closetesting.online</a></p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
