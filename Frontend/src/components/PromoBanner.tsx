"use client";  

import Image from "next/image";
import Link from "next/link";
import React from 'react'

export default function PromoBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-0 lg:px-8 py-4 lg:py-8">
      {/* Mobile-first: horizontal rectangle on small screens, preserve exact 453px on lg */}
      <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[453px] rounded-none lg:rounded-[24px] overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        
        {/* Decorative orange dots - top left (Desktop Only) */}
        <div className="absolute top-8 left-8 z-10 grid grid-cols-5 gap-2 hidden lg:grid">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"
            />
          ))}
        </div>

        {/* Decorative orange rectangle - bottom left (Desktop Only) */}
        <div className="absolute bottom-0 left-0 w-28 h-14 bg-[#FF6B35] z-10 hidden lg:block" />

        {/* Orange diagonal background - using clip-path for dynamic split */}
        <div 
          className="absolute inset-0 lg:left-[42%] left-[35%] sm:left-[40%]"
          style={{
            background: "linear-gradient(135deg, #FF7A4D 0%, #FF6339 50%, #E85A2E 100%)",
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
          aria-hidden="true"
        />

        {/* Content grid - Horizontal layout even on mobile */}
        <div className="relative grid grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1fr_1fr] h-full items-center">
          
          {/* Left: Text content */}
          <div className="flex flex-col justify-center items-start text-left pl-4 pr-2 py-2 lg:px-8 lg:py-12 z-10">
            
            {/* Heading with precise typography */}
            <h1 className="mb-2 lg:mb-6">
              <span className="block font-black text-[1.1rem] sm:text-[2rem] lg:text-[3.75rem] leading-[1.1] tracking-tight text-gray-900">
                Promote
              </span>
              <span className="block font-black text-[1.1rem] sm:text-[2rem] lg:text-[3.75rem] leading-[1.1] tracking-tight text-gray-900">
                Your Products
              </span>
              <span className="inline-flex items-center gap-2 font-black text-[1.1rem] sm:text-[2rem] lg:text-[3.75rem] leading-[1.1] tracking-tight">
                <span className="text-[1rem] sm:text-[2rem]">🚀</span>
                <span className="text-[#FF6B35]">Here</span>
              </span>
            </h1>

            {/* Description text - Compact on mobile */}
            <p className="text-gray-800 text-[10px] sm:text-[14px] lg:text-[16px] font-medium leading-[1.3] mb-3 lg:mb-8 max-w-[180px] sm:max-w-[300px] lg:max-w-[360px]">
              Increase visibility and attract more buyers with a featured placement
            </p>

            {/* CTA Button */}
            <div>
              <Link
                href="/vendor-dashboard/add-product"
                className="inline-block bg-[#FF6339] hover:bg-[#E85A2E] active:bg-[#D14F24] 
                           text-white font-bold text-[10px] sm:text-[14px] lg:text-[16px] 
                           px-4 py-2 sm:px-8 sm:py-3 lg:px-12 lg:py-4
                           rounded-full 
                           shadow-[0_4px_12px_rgba(255,107,53,0.3)] 
                           hover:shadow-[0_12px_28px_rgba(255,107,53,0.45)] 
                           transition-all duration-300 ease-out
                           hover:scale-[1.02] active:scale-[0.98]
                           focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/30 text-center"
                aria-label="Grab promotional spot"
              >
                Grab this spot
              </Link>
            </div>
          </div>

          {/* Right: Image section */}
          <div className="relative w-full h-full z-20 overflow-visible">
            <div className="absolute inset-0 flex items-end justify-center lg:justify-end translate-x-2 sm:translate-x-0">
              <div className="relative w-[130%] h-[110%] lg:w-[110%] lg:h-full">
                <Image
                  src="/assets/images/advertladynew.png"
                  alt="Professional woman promoting featured products"
                  fill
                  className="object-contain object-bottom select-none pointer-events-none"
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