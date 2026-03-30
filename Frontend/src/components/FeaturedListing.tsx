import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto mt-8 px-4 sm:px-6">
        <div className="relative bg-white rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:gap-x-6">

            {/* Text block */}
            <div className="w-full md:w-[60%] p-6 sm:p-8 lg:pl-12 lg:pr-6 z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight">
                <span className="block mb-2 text-zinc-400 text-sm sm:text-lg uppercase tracking-[0.2em] font-bold">Let&apos;s get one thing straight:</span>

                <span className="block">
                  At <span className="text-[#FF6B35]">234Deals,</span>
                </span>
                
                <span className="block">
                  Every listing is
                </span>

                <span className="block">
                  worth your time.
                </span>

                <div className="mt-6 sm:mt-8 space-y-1">
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-500 italic">There&apos;s truly no such thing</span>
                  <span className="relative inline-block text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900">
                    as a bad Deal!
                    <span className="absolute left-0 -bottom-1 w-full h-2 bg-[#FF6B35]/30 rounded-full -rotate-1"></span>
                  </span>
                </div>
              </h2>
            </div>

            {/* Image block - Ensure it doesn't overlap on smaller screens */}
            <div className="w-full md:w-[40%] flex justify-center md:justify-end p-6 md:p-8">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square">
                <Image
                  src="/images/litsingimage.svg"
                  alt="Quality Deals"
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}