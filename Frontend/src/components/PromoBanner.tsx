"use client";  

import Image from "next/image";
import React from 'react'

export default function PromoBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Mobile-first: auto height on small screens, preserve exact 453px on lg */}
      <div className="relative w-full h-auto lg:h-[453px] rounded-[24px] overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        
        {/* Decorative orange dots - top left */}
        <div className="absolute top-8 left-8 z-10 grid grid-cols-5 gap-2 hidden lg:grid">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"
            />
          ))}
        </div>

        {/* Decorative orange rectangle - bottom left */}
        <div className="absolute bottom-0 left-0 w-28 h-14 bg-[#FF6B35] z-10 hidden lg:block" />

        {/* Orange diagonal background - using clip-path for perfect angle */}
        <div 
          className="absolute inset-0 lg:left-[42%] left-0"
          style={{
            background: "linear-gradient(135deg, #FF7A4D 0%, #FF6339 50%, #E85A2E 100%)",
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
          aria-hidden="true"
        />

        {/* Content grid - fixed at 453px height */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1fr] h-full">
          
          {/* Left: Text content */}
          <div className="flex flex-col justify-center items-center text-center px-6 py-8 lg:px-8 lg:py-12 z-10">
            
            {/* Heading with precise typography - centered */}
            <h1 className="mb-4 lg:mb-6">
              <span className="block font-black text-[1.8rem] sm:text-[2.6rem] lg:text-[3.75rem] leading-[1.05] tracking-tight text-gray-900">
                Promote
              </span>
              <span className="block font-black text-[1.8rem] sm:text-[2.6rem] lg:text-[3.75rem] leading-[1.05] tracking-tight text-gray-900">
                Your Products
              </span>
              <span className="inline-flex items-center gap-3 font-black text-[1.8rem] sm:text-[2.6rem] lg:text-[3.75rem] leading-[1.05] tracking-tight">
                <span className="text-[1.4rem] sm:text-[2.5rem]">🚀</span>
                <span className="text-[#FF6B35]">Here</span>
              </span>
            </h1>

            {/* Description text - centered */}
            <p className="text-gray-900 text-sm sm:text-[16px] leading-[1.6] mb-6 lg:mb-8 max-w-[360px]">
              Increase visibility and
              <br />
              attract more buyers with
              <br />
              a featured placement
            </p>

            {/* CTA Button - centered */}
            <div>
              <button 
                className="bg-[#FF6339] hover:bg-[#E85A2E] active:bg-[#D14F24] 
                           text-white font-semibold text-sm sm:text-[16px] 
                           px-6 py-3 sm:px-10 sm:py-4 lg:px-12 lg:py-4
                           rounded-full 
                           shadow-[0_8px_20px_rgba(255,107,53,0.35)] 
                           hover:shadow-[0_12px_28px_rgba(255,107,53,0.45)] 
                           transition-all duration-300 ease-out
                           hover:scale-[1.02] active:scale-[0.98]
                           focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/30"
                aria-label="Grab promotional spot"
              >
                Grab this spot
              </button>
            </div>
          </div>

          {/* Right: Image section - fills the 453px height */}
          <div className="relative w-full lg:h-full z-20">
            <div className="w-full lg:absolute lg:bottom-0 lg:right-0 lg:w-[105%] lg:h-full -right-0">
              <div className="relative w-full pb-[66%] lg:pb-0 lg:h-full">
                <Image
                  src="/assets/images/advertlady.svg"
                  alt="Professional woman pointing and smiling, promoting featured products"
                  fill
                  className="absolute inset-0 object-contain object-bottom"
                  priority
                  quality={95}
                  sizes="(min-width:1024px) 600px, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}