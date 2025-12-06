import Layout from '../components/Layout';

export default function Disclaimer() {
  return (
    <Layout title="Disclaimer - Close Testing Group">
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Disclaimer</h1>
          <p className="text-gray-500 mb-8">Last updated: December 6, 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">No professional advice</h2>
              <p>Content on this website is for general information and educational purposes only. It does not constitute professional advice (legal, financial, medical, or other). Rely on professional advice where appropriate.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Accuracy of information</h2>
              <p>We strive for accuracy but do not guarantee that content is complete or up-to-date. We encourage verification from authoritative sources before acting on any information found here.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">External links</h2>
              <p>We link to third-party resources for convenience. We are not responsible for those websites or their content.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Ads & affiliates</h2>
              <p>We may display paid ads and use affiliate links. Use your discretion when clicking ads or following affiliate links. We are not liable for offers or transactions made through third-party advertisers.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Limitation of liability</h2>
              <p>We are not responsible for any damages or losses resulting from your use of the site. Use at your own risk.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
              <p>Questions about this disclaimer: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700">support@closetesting.online</a></p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
