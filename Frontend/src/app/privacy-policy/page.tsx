import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Your privacy is important to us. It is 234Deals's policy to respect your privacy regarding any information we may collect from you across our website.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information required to facilitate connections between buyers and sellers. This includes account details, listing information, and communication logs within our secure chat platform. We collect data by fair and lawful means, with your primary goal of transacting in mind.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Facilitating Connections</h2>
          <p>As a marketplace, our primary use of your data is to enable trade. For example, when you use the "Contact Seller" button, we facilitate the exchange of necessary information to start a conversation. We do not sell your personal data to third-party advertisers.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security & Safety</h2>
          <p>We use industry-standard encryption to protect your account and private communications. While we strive to protect your data, it is important to remember that as a marketplace, you may occasionally share information (like a meetup location) directly with another user. We encourage caution and the use of our internal messaging system to keep records of your deals.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
