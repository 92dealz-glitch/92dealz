import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Safety Tips</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-lg">At 92Dealz, your safety is our top priority. Please review these tips to ensure a safe and secure transacting experience on our platform.</p>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#708238]">1.</span> Meet in Safe, Public Places
            </h2>
            <p>For community safety, always meet in visible, busy public areas like popular malls, petrol stations, or coffee shops. Avoid private residences or secluded spots, and always plan meetups during daylight hours.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#708238]">2.</span> Inspect Before You Pay
            </h2>
            <p>The golden rule of marketplace trading: <strong>Never pay before you inspect.</strong> Physically check the item to ensure it matches the listing description and is in the promised condition before handing over any payment.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#708238]">3.</span> Look for the Verified Badge
            </h2>
            <p>Prioritize transacting with sellers who have the <strong>Verified Vendor</strong> badge. These sellers have submitted government-issued identification to our team, adding an extra layer of transparency to your deal.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#708238]">4.</span> Protect Your Financial Data
            </h2>
            <p>Be wary of anyone asking for advance payments, "delivery deposits," or bank login details. 92Dealz will never ask for your password or BVN over chat or phone call.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#708238]">5.</span> Trust Your Instincts
            </h2>
            <p>If a deal seems too good to be true, it likely is. If you feel uncomfortable at any point during a conversation or meetup, walk away. Use the "Report" button on any listing to flag suspicious activity to our team immediately.</p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}


