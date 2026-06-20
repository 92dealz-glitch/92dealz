import Image from "next/image";
import Link from "next/link";

export default function MarketplaceHero() {
  return (
    <>
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start bg-white">
          <div className="w-full relative rounded-lg overflow-hidden group">
          <div className="relative w-full pb-[56%] lg:pb-0 lg:h-[420px] rounded-lg overflow-hidden">
            {/* Single hero background */}
                        <img
              src="/images/marketplacenew.png"
              alt="Marketplace hero background"
              className="absolute inset-0 object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg pointer-events-none" />
          </div>
          </div>

          <div className="pt-6 lg:pt-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-black leading-tight">
              Pakistan’s #1 Marketplace
              <span className="block">for Buying & Selling</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl">
              Welcome to <strong className="text-black">92Dealz</strong>, Pakistan’s
              leading online marketplace where buyers and sellers connect
              effortlessly. From cars and real estate to electronics, fashion,
              and professional services, we make it simple to discover, buy, and
              sell everything you need—all in one convenient platform.
            </p>

            <div className="mt-6 lg:mt-8">
              <Link
                href="/vendor-dashboard/add-product"
                className="inline-block bg-[#708238] hover:bg-[#0b7c45] text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-md shadow-md"
              >
                Start Today!
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}


