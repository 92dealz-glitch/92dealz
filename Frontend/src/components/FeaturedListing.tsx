import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1240px] mx-auto mt-12 sm:mt-16 px-4">
        <div className="relative bg-white rounded-2xl border border-zinc-100/80 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 py-12 md:py-0">

            {/* Content Section - High priority responsive design */}
            <div className="w-full md:max-w-[65%] px-6 md:p-12 z-10 flex flex-col justify-center items-center md:items-end md:translate-x-12 text-center md:text-right">
              <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-black leading-[1.05] text-zinc-900 tracking-tight mb-4">
                Let&apos;s get one thing straight:
              </h2>
              
              <div className="text-2xl sm:text-4xl lg:text-[56px] font-black leading-[1.05] text-zinc-900 tracking-tight flex flex-col items-center md:items-end">
                <span className="block mb-1">
                  At <span className="text-[#ff7a2d]">234Deals,</span>
                </span>
                <span className="block mb-1">
                  Every listing is
                </span>
                <span className="block">
                  worth your time.
                </span>

                <div className="mt-6 md:mt-8 flex flex-col items-center md:items-end">
                  <span className="block text-xl sm:text-3xl lg:text-[48px] font-black leading-[1.1] text-zinc-900 tracking-tight opacity-90">
                    There&apos;s truly no such thing
                  </span>
                  <span className="relative inline-block text-2xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-[#ff7a2d] tracking-tight">
                    as a bad Deal!
                    <span className="absolute right-0 -bottom-2 w-[110%] h-[3px] sm:h-[6px] bg-gradient-to-l from-[#ff7a2d] to-transparent rounded-full opacity-80"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Section - Properly sized for mobile */}
            <div className="flex-shrink-0 flex items-center justify-center md:-translate-x-12 px-4">
              <div className="relative w-[280px] xs:w-[320px] sm:w-[380px] lg:w-[420px] aspect-square">
                <Image
                  src="/images/litsingimage.svg"
                  alt="Quality Deals"
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
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
