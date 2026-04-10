import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto mt-8 px-4 sm:px-6">
        <div className="relative bg-white rounded-lg overflow-hidden">
          <div className="flex flex-row items-center justify-center gap-x-0 sm:gap-x-2">

            {/* Text block */}
            <div className="max-w-[70%] p-4 sm:p-4 lg:pl-0 lg:pr-0 z-10 flex flex-col justify-center items-start">
              <h2 className="text-xs sm:text-lg uppercase tracking-[0.2em] font-bold text-zinc-400 mb-1 sm:mb-2">Let&apos;s get one thing straight:</h2>
              
              <div className="text-lg xs:text-xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight">
                <span className="block">
                  At <span className="text-[#f45c03]">234Deals,</span>
                </span>
                
                <span className="block">
                  Every listing is
                </span>

                <span className="block">
                  worth your time.
                </span>

                <div className="mt-3 sm:mt-8 space-y-1 sm:space-y-1">
                  <span className="block text-sm xs:text-base sm:text-2xl lg:text-3xl font-bold text-zinc-900">There&apos;s truly no such thing</span>
                  <span className="relative inline-block text-base xs:text-lg sm:text-3xl lg:text-4xl font-black text-[#f45c03]">
                    as a bad Deal!
                    <span className="absolute left-0 -bottom-0.5 w-full h-1 sm:h-2 bg-[#f45c03]/20 rounded-full -rotate-1"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Image block - Stay next to text even on mobile */}
            <div className="flex-shrink-0 p-0 sm:p-4 flex items-center justify-center">
              <div className="relative w-[155px] xs:w-[185px] sm:w-[280px] md:w-[320px] aspect-square">
                <Image
                  src="/images/litsingimage.svg"
                  alt="Quality Deals"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
