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
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Accepted Payment Methods</h2>
          <p>We accept major credit and debit cards, secure bank transfers, and selected digital wallets. All transactions are processed securely through our trusted payment gateways.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Vendor Fees and Payouts</h2>
          <p>Vendors operating on Premium plans will be billed monthly. Sales proceeds are held in escrow until the buyer confirms receipt of the goods, after which funds are disbursed to the vendor's designated bank account within 3 business days, deducting the applicable commission rates.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Refunds and Disputes</h2>
          <p>If a buyer is unsatisfied with a purchase due to it being significantly not as described or damaged upon arrival, they must initiate a dispute within 48 hours of delivery. 234Deals will mediate the dispute and, if resolved in favor of the buyer, issue a full refund to the original payment method.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
