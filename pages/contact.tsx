import Layout from '../components/Layout';
import { PAGE_SEO } from '../lib/seo-config';

export default function Contact() {
  return (
    <Layout 
      title={PAGE_SEO.contact.title}
      description={PAGE_SEO.contact.description}
      keywords={PAGE_SEO.contact.keywords}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-8">If you need help, have a suggestion, or want to report an issue, please use one of the methods below.</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Email</h2>
              <p>For general inquiries: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700 font-medium">support@closetesting.online</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact form</h2>
              <p>Use the contact form on the website to submit feedback or requests. Include a clear subject line and as much detail as possible to help us respond quickly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Business, advertising and partnerships</h2>
              <p>For business inquiries, sponsorship, or advertising, email: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700 font-medium">support@closetesting.online</a>. Please include your organization, proposal summary, and expected budget or collaboration type.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Support & response times</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>General questions: 24-72 hours</li>
                <li>Business inquiries: 3-5 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Privacy note</h2>
              <p>When you contact us we only use your personal information to respond to your inquiry. For more details, see our <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>.</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
