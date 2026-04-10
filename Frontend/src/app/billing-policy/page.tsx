import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BillingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Billing Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This Billing Policy applies to users and vendors transacting on the 234Deals platform.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Payment for Platform Services</h2>
          <p>This policy governs payments made to 234Deals for platform-specific services, including Vendor Premium Subscriptions, Featured Deal listings, and Boosting services. All such payments are processed securely through our verified payment partners.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Peer-to-Peer Transactions</h2>
          <p>As 234Deals is a marketplace facilitator, most transactions for physical goods occur directly between the buyer and the seller. The method of payment for these goods (e.g., cash on delivery, direct bank transfer) is negotiated between both parties. 234Deals is not responsible for refunding or mediating payments made outside of our official platform service fees.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Subscriptions & Cancellations</h2>
          <p>Vendor subscriptions are billed periodically. While you can cancel your subscription at any time, previously paid fees for Featured Listings or Boosting services are non-refundable as the service is rendered immediately upon activation.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
