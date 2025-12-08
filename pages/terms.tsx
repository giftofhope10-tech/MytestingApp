import Layout from '../components/Layout';
import { PAGE_SEO } from '../lib/seo-config';

export default function TermsConditions() {
  return (
    <Layout 
      title={PAGE_SEO.terms.title}
      description={PAGE_SEO.terms.description}
      keywords={PAGE_SEO.terms.keywords}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-gray-500 mb-8">Last updated: December 6, 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Acceptance of terms</h2>
              <p>By using this website you agree to these Terms & Conditions. If you do not agree, please do not use the site.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Use of content</h2>
              <p>All content on this website (text, images, code snippets) is for informational purposes only. You may read and share links to our content for personal, non-commercial use. Republishing our full articles or copying content without permission is prohibited. For permissions, contact us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">User obligations</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not post unlawful, abusive, or harmful content if the site allows user submissions.</li>
                <li>Do not attempt to interfere with site security or performance.</li>
                <li>Respect intellectual property rights of others.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-party links and content</h2>
              <p>We may link to external sites for reference. We are not responsible for content or practices on third-party websites. Review their terms and privacy policies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Advertising and monetization</h2>
              <p>The site may display advertisements, sponsored content, and affiliate links. You agree that we are not responsible for third-party ads or transactions between you and advertisers.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Limitation of liability</h2>
              <p>To the fullest extent permitted by law, we are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the site.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Changes to terms</h2>
              <p>We may modify these Terms & Conditions at any time. Changes will be published here with an updated date. Continued use after changes implies acceptance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
              <p>For questions about these terms, contact: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700">support@closetesting.online</a></p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
