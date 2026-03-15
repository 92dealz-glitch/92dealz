import Image from "next/image";

export default function MarketplaceHero() {
  return (
    <>
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start bg-white">
          <div className="w-full relative rounded-lg overflow-hidden">
            <div className="relative w-full pb-[56%] lg:pb-0 lg:h-[420px] rounded-lg overflow-hidden">
              <Image
                src="/images/marketplace.png"
                alt="234Deals marketplace hero"
                fill
                className="absolute inset-0 object-cover object-center"
                priority={true}
              />
            </div>
          </div>

          <div className="pt-6 lg:pt-12">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-black leading-tight">
              Nigeria’s #1 Marketplace
              <span className="block">for Buying & Selling</span>
            </h2>

            <p className="mt-4 sm:mt-6 text-gray-700 text-sm sm:text-base lg:text-lg max-w-xl">
              Welcome to <strong className="text-black">234Deals</strong>, Nigeria’s
              leading online marketplace where buyers and sellers connect
              effortlessly. From cars and real estate to electronics, fashion,
              and professional services, we make it simple to discover, buy, and
              sell everything you need—all in one convenient platform.
            </p>

            <div className="mt-6 lg:mt-8">
              <a
                href="#"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-md shadow-md"
              >
                Start Today!
              </a>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}
