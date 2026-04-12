import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1240px] mx-auto mt-12 sm:mt-16 px-4 sm:px-6">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-row items-center justify-center gap-x-0">

            {/* Text block - Enlarged mobile font, increased desktop gap */}
            <div className="max-w-[70%] py-8 pl-4 pr-0 sm:p-12 lg:pl-0 lg:pr-0 z-10 flex flex-col justify-center items-end translate-x-4 sm:translate-x-12 text-right">
              <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight whitespace-nowrap">Let&apos;s get one thing straight:</h2>
              
              <div className="text-xl xs:text-2xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight flex flex-col items-end">
                <span className="block whitespace-nowrap">
                  At <span className="text-[#ff7a2d]">234Deals,</span>
                </span>
                
                <span className="block whitespace-nowrap">
                  Every listing is
                </span>
                
                <span className="block whitespace-nowrap">
                  worth your time.
                </span>
 
                <div className="mt-2 sm:mt-4 flex flex-col items-end">
                  <span className="block text-xl xs:text-2xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-zinc-900 tracking-tight whitespace-nowrap">There&apos;s truly no such thing</span>
                  <span className="relative inline-block text-xl xs:text-2xl sm:text-4xl lg:text-[56px] font-black leading-[1.1] text-[#ff7a2d] tracking-tight whitespace-nowrap">
                    as a bad Deal!
                    <span className="absolute right-0 -bottom-1 w-[120%] h-[3px] sm:h-[5px] bg-gradient-to-l from-[#ff7a2d] to-transparent rounded-full rotate-1 opacity-80"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Image block - Moved left on desktop, larger on mobile */}
            <div className="flex-shrink-0 p-0 sm:p-4 flex items-center justify-center -translate-x-6 sm:-translate-x-12">
              <div className="relative w-[220px] xs:w-[260px] sm:w-[320px] md:w-[380px] aspect-square">
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
