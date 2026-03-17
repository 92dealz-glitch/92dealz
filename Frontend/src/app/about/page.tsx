import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">About 234Deals</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to <strong>234Deals</strong>, the marketplace by us, for us. We are dedicated to providing a vibrant platform where buyers and sellers can connect, trade, and thrive in a secure and user-friendly environment.
          </p>
          <p>
            Our mission is to empower local businesses, vendors, and everyday users by offering a seamless e-commerce experience. With a strong focus on community, trust, and quality, we strive to be the go-to destination for discovering amazing deals and unique products.
          </p>
          <p>
            Whether you are looking to declutter your home, start a new business, or simply find the best bargains, 234Deals is here to support your journey. Join us today and experience the future of online marketplaces.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
