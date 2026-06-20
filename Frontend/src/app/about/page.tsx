import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | 92Dealz",
  description: "Learn about 92Dealz — Pakistan's premier community-driven marketplace connecting buyers and sellers across the country.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">About 92Dealz</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-xl font-medium text-[#708238]">
            A Marketplace By Us, For Us.
          </p>
          <p>
            Welcome to <strong>92Dealz</strong>, Pakistan's premier community-driven marketplace. We aren’t just a store; we are the bridge that connects thousands of independent sellers with eager buyers in a secure, transparent, and vibrant environment.
          </p>
          <p>
            Our platform was built on a simple yet powerful idea: <strong>empowerment</strong>. We believe that every individual has something of value to offer, and every shopper deserves to find incredible deals without the middleman markups. As a marketplace, 92Dealz provides the tools, the technology, and the trust-building features—like our Verified Vendor badges—that allow local trade to flourish across Pakistan.
          </p>
          <p>
            <strong>What makes us different?</strong> Unlike traditional e-commerce retailers, we don’t hold inventory or dictate prices. Instead, we foster a peer-to-peer ecosystem where you interact directly with sellers, inspect items for yourself, and build genuine community connections.
          </p>
          <p>
            Whether you are a small business owner in Lahore looking to scale, a neighbor in Karachi decluttering your home, or a bargain hunter in Islamabad searching for your next treasure, 92Dealz is your home. Join us today and be part of the marketplace that’s redefining trade in Pakistan.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


