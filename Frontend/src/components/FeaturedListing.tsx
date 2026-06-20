import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1240px] mx-auto mt-12 sm:mt-16 px-4">
        <div className="relative bg-white rounded-2xl border border-zinc-100/80 shadow-sm">
          <div className="flex flex-row items-center justify-center gap-x-0 py-8 md:py-0 overflow-hidden">

            {/* Content Section - Side-by-side layout restored */}
            <div className="max-w-[65%] sm:max-w-[70%] z-10 flex flex-col justify-center items-end translate-x-8 sm:translate-x-12 text-right">
              <h2 className="text-[20px] xs:text-base sm:text-3xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight mb-2 sm:mb-4">
                Let&apos;s get one thing straight:
              </h2>
              
              <div className="text-[16px] xs:text-sm sm:text-3xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight flex flex-col items-end">
                <span className="block mb-0.5 sm:mb-1">
                  At <span className="text-[#708238]">92Dealz,</span>
                </span>
                <span className="block mb-0.5 sm:mb-1">
                  Every listing is
                </span>
                <span className="block">
                  worth your time.
                </span>

                <div className="mt-3 sm:mt-8 flex flex-col items-end">
                  <span className="block text-[14px] xs:text-base sm:text-3xl lg:text-[48px] font-black leading-[1.1] text-zinc-900 tracking-tight opacity-90">
                    There&apos;s truly no such thing
                  </span>
                  <span className="relative inline-block text-[18px] xs:text-base sm:text-3xl lg:text-[56px] font-black leading-[1.1] text-[#708238] tracking-tight">
                    as a bad Deal!
                    <span className="absolute right-0 -bottom-1 w-[110%] h-[2px] sm:h-[6px] bg-gradient-to-l from-[#708238] to-transparent rounded-full opacity-80"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Section - Side-by-side overlay restored */}
            <div className="flex-shrink-0 flex items-center justify-center translate-x-0 sm:-translate-x-12">
              <div className="relative w-[180px] xs:w-[180px] sm:w-[320px] lg:w-[420px] aspect-square">
                <Image
                  src="/images/listingmage.png"
                  alt="Quality Deals"
                  fill
                  className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)] sm:drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}


