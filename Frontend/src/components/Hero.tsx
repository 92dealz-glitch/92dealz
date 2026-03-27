import Image from "next/image";
import Link from "next/link";
import CategoryBar from "./CategoryBar";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden overflow-x-hidden">
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-20 pb-12 lg:pb-16">

        {/* MOBILE BACKGROUND IMAGE */}
        <div className="absolute inset-0 flex justify-center lg:hidden pointer-events-none">
          <Image
            src="/images/heroimagenew.png"
            alt="Happy shopper"
            width={460}
            height={460}
            priority
            className="-translate-y-26 object-contain"
          />

          {/* Softer fade (less blur effect) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white" />
        </div>

        {/* CONTENT */}
        <div className="relative flex items-center min-h-[420px] lg:min-h-[520px]">
          
          {/* DESKTOP HERO IMAGE (BACKGROUND LAYER) */}
          <div className="absolute left-[25%] top-[-40px] w-auto h-auto pointer-events-none hidden lg:block z-0">
            <div className="relative w-[750px] h-[520px] overflow-hidden">
              <Image
                src="/images/heroimagenew.png"
                alt="Happy shopper with shopping bags"
                fill
                priority
                className="object-contain object-top"
              />
              {/* Subtle left-to-right gradient to blend with background behind text */}
              <div className="absolute inset-y-0 left-0 w-[200px] bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10" />
              {/* Bottom ground merge gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
            </div>
          </div>

          <div className="relative z-10 max-w-[680px] mx-auto text-center lg:mx-0 lg:text-left">
            {/* HEADING */}
            <h1
              className="
                font-black
                text-black
                tracking-tight
                leading-[1.1]
                text-[30px]
                sm:text-[42px]
                lg:text-[64px]
                xl:text-[72px]
              "
            >
              {/* Desktop: forced line breaks with gradient */}
              <span className="hidden lg:block">
                <span className="sm:whitespace-nowrap">
                  Connecting{" "}
                  <span className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                    Smart
                  </span>
                </span>
                <br />
                <span className="sm:whitespace-nowrap">
                  Buyers and{" "}
                  <span className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                    Sellers
                  </span>
                </span>
                <br />
                Across Nigeria
              </span>

              {/* Mobile & tablet: all black text, first line together */}
              <span className="block lg:hidden">
                Connecting smart buyers and Sellers Across Nigeria
              </span>
            </h1>

            {/* SUBTEXT */}
            <p className="mt-6 max-w-[540px] mx-auto lg:mx-0 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-black">
              Buy, Sell & Discover Everything You Need — a convenient space where
              buyers and sellers meet, trade safely, and find value in every
              category with ease.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">

              {/* CTA (Reduced Width on Mobile) */}
              <Link
                href="/vendor-dashboard/add-product"
                className="
                  w-auto
                  bg-[#FF6B35] hover:bg-[#E85A28]
                  text-white font-semibold text-[15px]
                  px-6 py-3.5
                  rounded-lg
                  shadow-md hover:shadow-lg
                  transition-all duration-200 cursor-pointer
                "
              >
                Start Selling Today!
              </Link>

             

              {/* Arrow Button (Desktop Only) */}
              <button
                className="
                  hidden sm:inline-flex
                  items-center justify-center
                  w-12 h-12 rounded-full
                  bg-[#FF6B35] hover:bg-[#E85A28]
                  text-white
                  transition-all duration-200
                  cursor-pointer group
                  ml-0 sm:ml-2
                "
                aria-label="Learn more"
              >
                <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Mobile-only categories bar (horizontal scroll) */}
      <div className="lg:hidden mt-2">
        <CategoryBar />
      </div>

    </section>
  );
}
