import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center">Simple & Transparent Pricing</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Start selling on 234Deals today. Choose the plan that best fits your business needs. No hidden fees, no surprises.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Plan</h3>
            <div className="text-4xl font-extrabold text-orange-500 mb-6">Free</div>
            <ul className="space-y-3 mb-8 flex-grow text-gray-700">
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> List up to 10 active items</li>
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Standard support</li>
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Basic analytics</li>
            </ul>
            <Link href="/signup" className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition">Get Started</Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl shadow-orange-100 border-2 border-orange-500 p-8 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">RECOMMENDED</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Vendor</h3>
            <div className="text-4xl font-extrabold text-orange-500 mb-6">$19<span className="text-lg text-gray-500 font-medium">/month</span></div>
            <ul className="space-y-3 mb-8 flex-grow text-gray-700">
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited listings</li>
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Priority support</li>
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced analytics & insights</li>
              <li className="flex items-center gap-2"><svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Featured placement options</li>
            </ul>
            <Link href="/signup" className="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition">Upgrade to Pro</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
