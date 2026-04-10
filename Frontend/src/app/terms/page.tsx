import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Terms and Conditions</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Please read these Terms and Conditions carefully before using the 234Deals website and operating as a user or vendor on our platform.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using 234Deals, you accept and agree to be bound by the terms and provisions of this agreement. 234Deals is a marketplace platform that facilitates the connection between independent buyers and sellers.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. The Marketplace Model</h2>
          <p>234Deals does not hold inventory, sell products directly, or act as a retailer. Every listing on this platform is provided by an independent third-party vendor. Consequently, any contract for the sale of goods is strictly between the buyer and the seller.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct & Safety</h2>
          <p>Users are expected to conduct themselves with integrity. Fraudulent activity, harassment, or the listing of illegal goods is strictly prohibited. We strongly encourage all users to follow our <a href="/safety-tips" className="text-orange-600 hover:underline">Safety Tips</a> when transacting.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Vendor Responsibilities</h2>
          <p>Vendors represent and warrant that they have the legal right to sell their listed items and that all descriptions are accurate. Vendors are solely responsible for fulfillment, shipping, and any customer service related to their individual sales.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
          <p>Because 234Deals is a venue for connection, we are not involved in the actual transaction between buyers and sellers. We have no control over the quality, safety, or legality of items advertised, or the ability of sellers to complete a sale. Users use this platform at their own risk.</p>
          
          <p className="mt-8 text-sm text-gray-500">For any legal inquiries regarding these terms, please contact 234deals@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
