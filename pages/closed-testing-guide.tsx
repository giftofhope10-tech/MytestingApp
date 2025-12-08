import Layout from '../components/Layout';
import Link from 'next/link';
import { generateFAQSchema, PAGE_SEO } from '../lib/seo-config';

const faqs = [
  { question: 'What is Google Play closed testing?', answer: 'Closed testing allows developers to share their Android app with a limited group of testers before public release. Testers must be invited and added to a testing list to access the app.' },
  { question: 'How many testers do I need for closed testing?', answer: 'Google Play requires at least 20 testers who have opted in and remained active for at least 14 consecutive days before you can publish to production.' },
  { question: 'What is the difference between closed and open testing?', answer: 'Closed testing requires manual invitation of testers, while open testing allows anyone to join. Closed testing is more controlled and suitable for early-stage testing.' },
  { question: 'How long does closed testing take?', answer: 'The minimum testing period is 14 consecutive days with at least 20 active testers. This ensures your app receives adequate testing before launch.' },
  { question: 'Can testers leave reviews during closed testing?', answer: 'Reviews from closed testing are private and not visible on the Google Play Store. They are only accessible to the developer.' },
];

export default function ClosedTestingGuide() {
  const faqSchema = generateFAQSchema(faqs);

  return (
    <Layout 
      title={PAGE_SEO.closedTestingGuide.title}
      description={PAGE_SEO.closedTestingGuide.description}
      keywords={PAGE_SEO.closedTestingGuide.keywords}
      breadcrumbs={[{ name: 'Closed Testing Guide', path: '/closed-testing-guide' }]}
      structuredData={faqSchema}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-600 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Complete Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            Google Play Closed Testing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about closed testing on Google Play Store
          </p>
        </div>

        <article className="prose prose-slate max-w-none">
          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What is Closed Testing?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Google Play closed testing is a controlled pre-release testing track that allows Android developers to share their app with a specific group of testers before making it publicly available. Unlike open testing where anyone can opt in, closed testing requires developers to manually invite testers.
            </p>
            <p className="text-slate-600 leading-relaxed">
              This testing method is ideal for gathering feedback from a trusted group, testing new features, and ensuring app stability before a wider release.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Requirements for Closed Testing</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Minimum 20 Testers</h3>
                  <p className="text-slate-600">Google Play requires at least 20 testers to have opted in and remained active.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-slate-800">14 Consecutive Days</h3>
                  <p className="text-slate-600">Testers must remain active for at least 14 consecutive days of testing.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-slate-800">App Content Rating</h3>
                  <p className="text-slate-600">Complete the content rating questionnaire for your app.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-slate-800">Store Listing</h3>
                  <p className="text-slate-600">Prepare your store listing with screenshots, description, and app icon.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Closed vs Open Testing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold text-slate-800">Feature</th>
                    <th className="py-3 px-4 font-semibold text-slate-800">Closed Testing</th>
                    <th className="py-3 px-4 font-semibold text-slate-800">Open Testing</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4">Access Control</td>
                    <td className="py-3 px-4">Invite-only</td>
                    <td className="py-3 px-4">Anyone can join</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4">Tester Limit</td>
                    <td className="py-3 px-4">Unlimited (managed list)</td>
                    <td className="py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4">Feedback</td>
                    <td className="py-3 px-4">Private reviews</td>
                    <td className="py-3 px-4">Private reviews</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Best For</td>
                    <td className="py-3 px-4">Early-stage, trusted feedback</td>
                    <td className="py-3 px-4">Large-scale pre-launch</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-100 pb-4 last:border-0">
                  <h3 className="font-semibold text-slate-800 mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-6">Ready to start closed testing for your app?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Submit Your App
            </Link>
            <Link
              href="/beta-testers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Become a Tester
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
