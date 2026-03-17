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
          <p>By accessing and using our marketplace, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. User Conduct</h2>
          <p>Users are expected to conduct themselves in a respectful manner. Fraudulent activity, harassment, or the sale of illegal goods is strictly prohibited and will result in immediate account termination.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Vendor Responsibilities</h2>
          <p>Vendors represent and warrant that they have the right to sell the items listed and that the items match their descriptions. Vendors are responsible for timely shipping and customer service related to their products.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Limitation of Liability</h2>
          <p>234Deals serves as a venue for buyers and sellers to connect. We are not directly involved in the transaction between buyers and sellers and thus have no control over the quality, safety, or legality of the items advertised.</p>
          
          <p className="mt-8 text-sm text-gray-500">For any questions regarding these terms, please contact 234deals@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
