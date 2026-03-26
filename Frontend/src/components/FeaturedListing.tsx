import Image from "next/image";

export default function FeaturedListing() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto mt-8 px-4 sm:px-6">
        <div className="relative bg-white rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:gap-x-6">

            {/* Text block */}
            <div className="w-full md:w-[65%] p-6 md:p-8 md:pl-12 md:pr-6">
              <h2 className="text-2xl sm:text-3xl md:text-[56px] font-extrabold leading-[1.2] text-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]">
                <span className="block md:whitespace-nowrap pr-0 sm:pr-2">Let&apos;s get one thing straight:</span>

                <span className="block md:whitespace-nowrap">
                  <span className="text-[#FF6B35]">at 234Deals,</span> every listing
                </span>

                <span className="block md:whitespace-nowrap">is worth your time.</span>

                <span className="block mt-4 md:mt-2 md:whitespace-nowrap">There&apos;s truly no such thing</span>

                <span className="block relative md:whitespace-nowrap">
                  as a bad find!
                  <span className="absolute left-0 -bottom-2 w-32 sm:w-40 md:w-56 h-1.5 bg-[#FF6B35] rounded-full opacity-90 -skew-x-6"></span>
                </span>
              </h2>
            </div>

            {/* Image block - hidden on mobile, visible at md+ */}
            <div className="hidden md:flex w-full md:w-[35%] justify-center md:justify-end md:pr-8 mt-6 md:mt-0">
              <Image
                src="/images/litsingimage.svg"
                alt="listing people"
                width={320}
                height={320}
                className="w-full max-w-[220px] md:max-w-[320px] h-auto object-contain drop-shadow-xl"
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}