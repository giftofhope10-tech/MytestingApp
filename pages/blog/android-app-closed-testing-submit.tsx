import Link from 'next/link';
import Layout from '../../components/Layout';

export default function Blog2() {
  return (
    <Layout title="Android App ko Google Play Closed Testing me Kaise Submit Karein? - Close Testing Group">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-indigo-600 hover:text-indigo-700 mb-6 inline-block">← Back to Blog</Link>
        
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <div className="text-sm text-indigo-600 mb-4">December 6, 2025</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Android App ko Google Play Closed Testing me Kaise Submit Karein? (Step-by-Step)</h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>Yeh article un developers ke liye hai jo apni Android app ko Google Play par closed testing ke zariye distribute karna chahte hain. Main har step asaan aur practical language me bataunga — taake aap seedha Play Console me ja kar build upload kar sakein aur testers ko invite kar sakein.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Tayari — Build aur information</h2>
            <p>Sab se pehle ensure karein ke aapki build production ke qareeb ho. AAB format recommended hai kyun ke Play Store is format ko prefer karta hai. Build me versionCode, versionName, permissions, minimum SDK jaise fields sahi hon. Agar app me kisi external service ka API key use ho raha hai to development keys aur production keys ko alag rakhein.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 1: Google Play Console access</h2>
            <p>Agar aap ke paas already developer account hai to sign in karein. Agar nahi hai to developer account create karna hoga (once time registration fee hoti hai). Console ka dashboard use karna initially confusing lag sakta hai, lekin basic flow samajh aane ke baad straightforward hota hai.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 2: Nayi app create karna</h2>
            <p>Console me &quot;Create app&quot; button pe click kar ke basic information fill karein — app ka naam, default language, app ya game, free ya paid. Ye information app listing ke liye use hoti hai lekin closed testing me listing public nahi hoti; phir bhi sahi metadata rakhna zaroori hota hai.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 3: App build (AAB/APK) banayein</h2>
            <p>Android Studio me signed AAB generate karein. Build ke sath changelog aur release notes bhi prepare karein taake testers ko pata ho ke naya build kya change karta hai. Testing builds me debug logs ya verbose logging include na karein — lekin crash reporting enable karein (e.g., Firebase Crashlytics).</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 4: Closed track create karna</h2>
            <p>Console me left menu se <em>Release → Testing → Closed testing</em> ko choose karein. Yahan aap new closed track create kar sakte hain. Track ka naam aap apni convenience ke liye rakh sakte hain (e.g., &quot;Alpha-Internal&quot;, &quot;Beta-Testing-June&quot;).</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 5: Build upload karna</h2>
            <p>Create a new release, upload your AAB file, aur release notes add karein. AAB upload hone ke baad console automatic checks chalata hai (basic policy checks). Jab build ready ho jaye to aap release ko save kar sakte hain magar rollout tab tak na karein jab tak testers add na kar lein.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 6: Testers add karna</h2>
            <p>Do main tareeqay hain:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email list:</strong> Testers ke emails add karein. Google in emails ko verify karega aur unko testing access dega.</li>
              <li><strong>Testing link:</strong> Aap ek private opt-in link generate kar sakte hain aur jise aap share karenge wo log join kar saken ge.</li>
            </ul>
            <p>Email method zyada controlled hota hai, link method convenient hota hai agar aapko ek community me share karna ho.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 7: Rollout aur review</h2>
            <p>Testers add karne ke baad release ko rollout karein. Console kuch automated checks chalata hai; closed testing ka approval generally fast hota hai (minutes to hours). Agar koi policy issue hua to console aapko notify karega.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 8: Testers ko guide karna</h2>
            <p>Testers ko clear instructions bhejein: kis build ko test karna hai, kon se scenarios check karne hain, feedback kaise bhejna hai. Ek simple feedback template provide karein: steps to reproduce, device model, Android version, screenshot/screen recording, expected vs actual behavior.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 9: Feedback ko manage karna</h2>
            <p>Use a spreadsheet, Trello, or Jira to log reports. Tag issues as critical, medium, low. Critical issues (crashes, data loss, login failures) ko pehle fix karein. Har fix ke baad naya build upload karein aur testers ko notify karein.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 10: Production release ki planning</h2>
            <p>Jab testing stable ho jaye aur critical issues fix ho jayein to aap final production release plan karein. Production release me aapko additional store listing elements (screenshots, descriptions, ratings target) ready rakhne chahiye. Closed testing se milne wali learning ko release notes me include karein.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Conclusion</h2>
            <p>Google Play Closed Testing ka proper use aapki app ko market-ready banata hai. Step-by-step approach se aap controlled environment me real users se feedback le kar product ko polish kar sakte hain.</p>
          </div>
        </article>
      </div>
    </Layout>
  );
}
