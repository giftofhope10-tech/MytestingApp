import Link from 'next/link';
import Layout from '../components/Layout';
import { PAGE_SEO, generateFAQSchema } from '../lib/seo-config';

const faqItems = [
  { question: 'What is this website about?', answer: 'We publish practical guides and tutorials for app developers and testers, with a focus on testing workflows, Play Store distribution, and beta management. We also provide a platform for developers to find testers for their apps.' },
  { question: 'Is the content original?', answer: 'Yes — all content is written by our team and reviewed for accuracy. We do not copy content from other sites.' },
  { question: 'Do you use advertising?', answer: 'Yes — we display third-party ads (for example Google AdSense) to support the site.' },
  { question: 'How can I request content?', answer: 'Use the Contact page to request topics. We review requests and prioritize based on user value and feasibility.' },
  { question: 'How do you handle privacy?', answer: 'We collect minimal personal data and only when voluntarily submitted. See our Privacy Policy for full details.' },
  { question: 'How to report a security issue or copyright takedown?', answer: 'For security or copyright concerns, please contact us immediately at support@closetesting.online.' },
];

export default function FAQ() {
  const faqSchema = generateFAQSchema(faqItems);
  
  return (
    <Layout 
      title={PAGE_SEO.faq.title}
      description={PAGE_SEO.faq.description}
      keywords={PAGE_SEO.faq.keywords}
      breadcrumbs={[{ name: 'FAQ', path: '/faq' }]}
      structuredData={faqSchema}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions (FAQ)</h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What is this website about?</h2>
              <p>We publish practical guides and tutorials for app developers and testers, with a focus on testing workflows, Play Store distribution, and beta management. We also provide a platform for developers to find testers for their apps.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Is the content original?</h2>
              <p>Yes — all content is written by our team and reviewed for accuracy. We do not copy content from other sites.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Do you use advertising?</h2>
              <p>Yes — we display third-party ads (for example Google AdSense) to support the site. Please see our <Link href="/ads-disclosure" className="text-indigo-600 hover:text-indigo-700">Advertising & AdSense Disclosure</Link> for details.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How can I request content?</h2>
              <p>Use the <Link href="/contact" className="text-indigo-600 hover:text-indigo-700">Contact page</Link> to request topics. We review requests and prioritize based on user value and feasibility.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How do you handle privacy?</h2>
              <p>We collect minimal personal data and only when voluntarily submitted. See our <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link> for full details.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to report a security issue or copyright takedown?</h2>
              <p>For security or copyright concerns, please contact us immediately at <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700">support@closetesting.online</a>. See our <Link href="/dmca" className="text-indigo-600 hover:text-indigo-700">DMCA and Copyright</Link> page for copyright takedown instructions.</p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
