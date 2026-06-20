import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Affiliate Program</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Partner with <strong>92Dealz</strong> and earn rewards by promoting our marketplace! Our affiliate program is designed to mutually benefit content creators, influencers, and community leaders.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Sign Up:</strong> Register for our affiliate program for free.</li>
            <li><strong>Promote:</strong> Share your unique affiliate links with your audience.</li>
            <li><strong>Earn:</strong> Receive commissions for every successful referral or sale generated through your links.</li>
          </ul>
          <p className="mt-6">
            If you have an engaged audience and a passion for e-commerce, we would love to have you on board. For more information or to apply, please contact us at <a href="mailto:92dealz@gmail.com" className="text-[#708238] hover:underline">92dealz@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


