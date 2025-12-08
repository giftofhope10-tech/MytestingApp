import Layout from '../components/Layout';

export default function DMCA() {
  return (
    <Layout 
      title="DMCA | Close Testing Group"
      description="DMCA and copyright policy for Close Testing Group."
      keywords={['dmca', 'copyright', 'takedown']}
    >
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">DMCA & Copyright Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: December 6, 2025</p>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our policy</h2>
              <p>We respect copyright law and expect users to do the same. If you believe content on this site infringes your copyright, send a DMCA takedown notice as described below.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to submit a DMCA notice</h2>
              <p>Please include the following in your takedown request:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your contact information (name, email, phone)</li>
                <li>Identification of the copyrighted work you claim is infringed</li>
                <li>Exact URL(s) of the infringing material on our site</li>
                <li>A statement that you have a good-faith belief the use is not authorized</li>
                <li>A statement under penalty of perjury that the information in your notice is accurate</li>
                <li>Your electronic or physical signature</li>
              </ul>
              <p>Send DMCA notices to: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700 font-medium">support@closetesting.online</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Counter-notice</h2>
              <p>If you believe your content was removed in error, you may submit a counter-notice including your contact details, identification of the material removed, and a statement under penalty of perjury that you have a good-faith belief the material was removed as a result of mistake or misidentification.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Repeat infringers</h2>
              <p>We reserve the right to terminate accounts of repeat infringers in appropriate circumstances.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
              <p>Questions regarding copyright: <a href="mailto:support@closetesting.online" className="text-indigo-600 hover:text-indigo-700 font-medium">support@closetesting.online</a></p>
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
}
