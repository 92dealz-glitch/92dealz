"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

const banners = [
  {
    id: 1,
    title1: "Promote",
    title2: "Your Products",
    accent: "Here",
    emoji: "🚀",
    description: "Increase visibility and attract more buyers with a featured placement",
    buttonText: "Grab this spot",
    href: "/vendor-dashboard/add-product",
    image: "/assets/images/advertladynew.png",
    theme: "orange",
  },
  {
    id: 2,
    titleSmall: "Boost Your",
    title1: "Sales",
    accent: "Feature Your",
    title2: "Deals",
    description: "Put your product in front of thousands of shoppers",
    buttonText: "Get Featured",
    href: "/vendor-dashboard/add-product",
    image: "/assets/images/advertlady2.png",
    theme: "green",
  },
];

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { showVendorUpgrade } = useAlert();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSellClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (!token) {
      router.push("/signup");
      return;
    }
    const role = (typeof window !== "undefined" ? window.localStorage.getItem("role") || "user" : "user").toLowerCase();
    if (role === "user") {
      const confirmed = await showVendorUpgrade(
        "To Add a Product you need to Upgrade your account into Vendor, it will just take a minute"
      );
      if (confirmed) {
        router.push("/account-settings");
      }
    } else {
      router.push("/vendor-dashboard/add-product");
    }
  };

  return (
    <section className="w-full max-w-full mx-auto px-0 lg:px-8 py-4 lg:py-8 overflow-hidden">
      <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[453px] rounded-none lg:rounded-[32px] overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full h-full relative">
              
              {/* Decorative elements based on theme */}
              {banner.theme === 'orange' ? (
                <>
                  <div className="absolute top-10 left-10 z-10 grid grid-cols-5 gap-2 hidden lg:grid opacity-20">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#f45c03]" />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-32 h-16 bg-[#f45c03]/10 z-10 hidden lg:block rounded-tr-3xl" />
                  <div 
                    className="absolute inset-0 lg:left-[45%] left-[38%] sm:left-[42%]"
                    style={{
                      background: "linear-gradient(135deg, #f45c03 0%, #f45c03 50%, #f45c03 100%)",
                      clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="absolute top-10 right-10 z-10 hidden lg:flex gap-4 opacity-30">
                     <div className="w-4 h-4 bg-[#FFD700] rounded-sm rotate-45" />
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden lg:grid grid-cols-3 gap-3 opacity-40">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-emerald-600" />
                    ))}
                  </div>
                  <div 
                    className="absolute inset-0 lg:right-[45%] right-[38%] sm:right-[42%]"
                    style={{
                      background: "linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)",
                      clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 100%)",
                    }}
                  />
                </>
              )}

              {/* Slide Content */}
              <div className={`relative grid h-full items-center ${banner.theme === 'orange' ? 'grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.1fr_0.9fr]' : 'grid-cols-[0.85fr_1.15fr] lg:grid-cols-[0.9fr_1.1fr]'}`}>
                
                {/* Image Section (Calculated order/position) */}
                <div className={`relative w-full h-full z-20 overflow-visible ${banner.theme === 'green' ? 'order-1' : 'order-2'}`}>
                   <div className={`absolute inset-0 flex items-end justify-center ${banner.theme === 'orange' ? 'lg:justify-end translate-x-2 lg:translate-x-0' : 'lg:justify-start -translate-x-4 lg:translate-x-0'}`}>
                      <div className="relative w-[140%] h-[115%] lg:w-[110%] lg:h-[105%]">
                        <Image
                          src={banner.image}
                          alt="Banner Promotional"
                          fill
                          className="object-contain object-bottom pointer-events-none select-none"
                          priority
                          quality={98}
                        />
                      </div>
                   </div>
                </div>

                {/* Text Content Section */}
                <div className={`flex flex-col justify-center text-left pl-6 pr-4 lg:pl-16 z-10 h-full ${banner.theme === 'green' ? 'order-2 items-start lg:items-center lg:text-center lg:pr-16 ml-auto' : 'order-1 items-start'}`}>
                  {banner.theme === 'orange' ? (
                    <h1 className="mb-2 lg:mb-6">
                      <span className="block font-black text-[1.2rem] sm:text-[2.2rem] lg:text-[4.2rem] leading-[1.05] tracking-tight text-gray-900">
                        {banner.title1}
                      </span>
                      <span className="block font-black text-[1.2rem] sm:text-[2.2rem] lg:text-[4.2rem] leading-[1.05] tracking-tight text-gray-900">
                        {banner.title2}
                      </span>
                      <span className="inline-flex items-center gap-2 font-black text-[1.2rem] sm:text-[2.2rem] lg:text-[4.2rem] leading-[1.05] tracking-tight">
                        <span className="text-[1.1rem] sm:text-[2.2rem]">{banner.emoji}</span>
                        <span className="text-[#f45c03]">{banner.accent}</span>
                      </span>
                    </h1>
                  ) : (
                    <div className="mb-2 lg:mb-6">
                      <p className="font-bold text-[0.8rem] sm:text-[1.2rem] lg:text-[1.8rem] text-gray-900 mb-0 lg:mb-1">
                        {banner.titleSmall}
                      </p>
                      <h1 className="font-black text-[1.8rem] sm:text-[3rem] lg:text-[5.5rem] leading-[0.9] tracking-tighter text-gray-900">
                        {banner.title1}
                      </h1>
                      <h2 className="font-black text-[1.1rem] sm:text-[1.8rem] lg:text-[3.2rem] leading-[1.1] tracking-tight text-emerald-600 mt-1">
                        {banner.accent}
                      </h2>
                      <h2 className="font-black text-[1.1rem] sm:text-[1.8rem] lg:text-[3.2rem] leading-[1.1] tracking-tight text-gray-900">
                        {banner.title2}
                      </h2>
                    </div>
                  )}

                  <p className="text-gray-700 text-[10px] sm:text-[14px] lg:text-[18px] font-medium leading-[1.3] mb-4 lg:mb-10 max-w-[180px] sm:max-w-[300px] lg:max-w-[420px] opacity-90">
                    {banner.description}
                  </p>

                  <button
                    onClick={handleSellClick}
                    className={`inline-block font-bold text-[10px] sm:text-[14px] lg:text-[16px] 
                               px-6 py-2.5 sm:px-10 sm:py-3.5 lg:px-14 lg:py-4.5
                               rounded-full transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.97]
                               ${banner.theme === 'orange' 
                                 ? 'bg-[#f45c03] text-white shadow-[0_6px_20px_rgba(255,107,53,0.3)] hover:shadow-[0_12px_30px_rgba(255,107,53,0.4)] hover:bg-[#f45c03]' 
                                 : 'bg-white text-emerald-700 border-2 border-emerald-600 shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-emerald-50 hover:border-emerald-700'
                               }`}
                  >
                    {banner.buttonText}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-6 lg:left-16 flex gap-2 z-30">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i ? "w-8 bg-gray-900" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
