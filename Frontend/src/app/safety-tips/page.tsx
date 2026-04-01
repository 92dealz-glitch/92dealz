import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Safety Tips</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-lg">At 234Deals, your safety is our top priority. Please review these tips to ensure a safe and secure transacting experience on our platform.</p>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-orange-500">1.</span> Protect Your Personal Information
            </h2>
            <p>Never share sensitive personal information such as your bank account details, BVN, or passwords unless proceeding through our secure, verified payment channels.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-orange-500">2.</span> Meet in Public
            </h2>
            <p>If you are meeting a buyer or seller in person, always choose a busy, public location during daylight hours. Consider bringing a friend with you.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-orange-500">3.</span> Inspect Items Carefully
            </h2>
            <p>Before completing a transaction, physically inspect the item to ensure it matches the description provided in the listing. Do not pay before confirming the item's condition.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-orange-500">4.</span> Report Suspicious Activity
            </h2>
            <p>If a listing seems too good to be true, it probably is. Use our built-in reporting tools to alert our moderation team of any suspicious users or listings.</p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
