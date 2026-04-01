"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryBar from "./CategoryBar";

const HERO_IMAGES = [
  "/images/heroimage3.png",
  "/images/heroimage4.png",
  "/images/heroimage5.png",
  "/images/heroimage6.png",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden overflow-x-hidden min-h-[600px] lg:min-h-0">
      
      {/* PERMANENT FAINTED BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "url('/images/mapHeroImagebackground.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-12 lg:pb-16 mt-6 lg:mt-0">

        {/* MOBILE CAROUSEL */}
        <div className="absolute inset-0 flex justify-center lg:hidden pointer-events-none -translate-y-8">
          {HERO_IMAGES.map((img, i) => (
            <div 
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === index ? "opacity-100 scale-105" : "opacity-0 scale-95"}`}
            >
              <Image
                src={img}
                alt={`Hero ${i + 1}`}
                width={460}
                height={460}
                priority
                className="mx-auto object-contain opacity-90"
              />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent backdrop-blur-[1px] z-10" />
        </div>

        {/* CONTENT */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 min-h-[500px] lg:min-h-[520px]">
          
          <div className="relative z-20 max-w-[680px] mx-auto text-center lg:mx-0 lg:text-left order-2 lg:order-1 pt-80 sm:pt-96 lg:pt-0">
            {/* HEADING */}
            <h1
              className="
                font-black
                text-black
                tracking-tight
                leading-[1.1]
                text-[32px]
                sm:text-[48px]
                lg:text-[68px]
                xl:text-[76px]
              "
            >
              <span className="hidden lg:block drop-shadow-sm">
                <span className="sm:whitespace-nowrap">
                  Connecting{" "}
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#f97316] bg-clip-text text-transparent">
                    Smart
                  </span>
                </span>
                <br />
                <span className="sm:whitespace-nowrap">
                  Buyers and{" "}
                  <span className="bg-gradient-to-r from-[#FF6B35] to-[#f97316] bg-clip-text text-transparent">
                    Sellers
                  </span>
                </span>
                <br />
                Across Nigeria
              </span>

              <span className="block lg:hidden">
                Connecting smart buyers and Sellers <br/>
                <span className="text-[#FF6B35]">Across Nigeria</span>
              </span>
            </h1>

            {/* SUBTEXT */}
            <p className="mt-8 max-w-[540px] mx-auto lg:mx-0 text-[15px] sm:text-[17px] lg:text-[19px] font-medium leading-[1.6] text-zinc-900/80">
              Buy, Sell & Discover Everything You Need — a convenient space where
              buyers and sellers meet, trade safely, and find value in every
              category with ease.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/vendor-dashboard/add-product"
                className="
                  w-full sm:w-auto
                  bg-[#FF6B35] hover:bg-[#E85A28]
                  text-white font-bold text-[16px]
                  px-10 py-4
                  rounded-xl
                  shadow-[0_10px_20px_-5px_rgba(255,107,53,0.3)]
                  hover:shadow-[0_15px_25px_-5px_rgba(255,107,53,0.4)]
                  hover:-translate-y-0.5
                  transition-all duration-300 cursor-pointer
                "
              >
                Start Selling Today!
              </Link>

              <button
                className="
                  hidden sm:inline-flex
                  items-center justify-center
                  w-14 h-14 rounded-full
                  border-2 border-zinc-200
                  bg-white hover:border-[#FF6B35]
                  text-zinc-400 hover:text-[#FF6B35]
                  transition-all duration-300
                  cursor-pointer group
                "
                aria-label="Learn more"
              >
                <span className="text-xl group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* DESKTOP CAROUSEL (RIGHT SIDE) */}
          <div className="relative w-full h-0 lg:h-[580px] pointer-events-none hidden lg:block z-0 order-1 lg:order-2">
            <div className="relative w-full h-full overflow-visible">
               {HERO_IMAGES.map((img, i) => (
                  <div 
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image
                      src={img}
                      alt={`Hero ${i + 1}`}
                      fill
                      priority
                      className="object-contain object-top drop-shadow-2xl"
                    />
                  </div>
                ))}
              
              {/* Refined gradient masks */}
              <div className="absolute inset-y-0 left-0 w-[300px] bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden mt-2 border-t border-zinc-100">
        <CategoryBar />
      </div>

    </section>
  );
}
