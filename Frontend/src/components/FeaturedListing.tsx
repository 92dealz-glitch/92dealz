import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto mt-8 px-4 sm:px-6">
        <div className="relative bg-white rounded-lg overflow-hidden">
          <div className="flex flex-row items-center md:items-start gap-x-2 sm:gap-x-6">

            {/* Text block */}
            <div className="w-[60%] sm:w-[65%] p-4 sm:p-8 lg:pl-12 lg:pr-6 z-10">
              <h2 className="text-[10px] xs:text-xs sm:text-lg uppercase tracking-[0.2em] font-bold text-zinc-400 mb-1 sm:mb-2">Let&apos;s get one thing straight:</h2>
              
              <div className="text-sm xs:text-base sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight">
                <span className="block">
                  At <span className="text-[#f45c03]">234Deals,</span>
                </span>
                
                <span className="block">
                  Every listing is
                </span>

                <span className="block">
                  worth your time.
                </span>

                <div className="mt-2 sm:mt-8 space-y-0.5 sm:space-y-1">
                  <span className="block text-[10px] xs:text-xs sm:text-2xl lg:text-3xl font-bold text-zinc-900">There&apos;s truly no such thing</span>
                  <span className="relative inline-block text-xs xs:text-sm sm:text-3xl lg:text-4xl font-black text-[#f45c03]">
                    as a bad Deal!
                    <span className="absolute left-0 -bottom-0.5 w-full h-1 sm:h-2 bg-[#f45c03]/20 rounded-full -rotate-1"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Image block - Stay next to text even on mobile */}
            <div className="w-[40%] sm:w-[35%] flex justify-end p-2 sm:p-8">
              <div className="relative w-full max-w-[120px] sm:max-w-[320px] aspect-square">
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
