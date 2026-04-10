import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CopyrightPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Copyright Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>234Deals respects the intellectual property rights of others and expects its users to do the same.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Identification of Content</h2>
          <p>The 234Deals platform contains two types of content: User-Generated Content (e.g., product listings, descriptions, and photos uploaded by vendors) and Platform Content (e.g., our brand logos, site design, and code).</p>
          <p>While 234Deals owns all Platform Content, individual vendors represent that they own or have the lawful right to use the content within their listings. As a marketplace facilitator, we provide a notice and take-down process for any intellectual property disputes.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Notice of Copyright Infringement</h2>
          <p>If you are a copyright owner or an agent thereof and believe that any content on the 234Deals platform infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing our Copyright Agent with the necessary information in writing.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Counter-Notice</h2>
          <p>If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, you may send a counter-notice.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
