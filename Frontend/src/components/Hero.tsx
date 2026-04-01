"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryBar from "./CategoryBar";

const HERO_IMAGES = [
  "https://res.cloudinary.com/dgjyfvtph/image/upload/v1775037497/heroimage3_ihpozi.png",
  "https://res.cloudinary.com/dgjyfvtph/image/upload/v1775037522/heroimage4_biz6z7.png",
  "https://res.cloudinary.com/dgjyfvtph/image/upload/v1775037574/heroimage5_lzfzj0.png",
  "https://res.cloudinary.com/dgjyfvtph/image/upload/v1775037580/heroimage6_xulxg9.png",
];

const SLIDES = [
  {
    title: (
      <>
        Connecting <span className="text-[#f45c03]">Smart</span> Buyers and <span className="text-[#f45c03]">Sellers</span> Across Nigeria
      </>
    ),
    subheading: "Buy, Sell & Discover everything You need, a convenient space where buyers and sellers meet, trade safely, and find value in every category with ease.",
    images: [HERO_IMAGES[0]],
  },
  {
    title: (
      <>
        Explore Deals That <span className="text-[#f45c03]">Match</span> Your <span className="text-[#f45c03]">Lifestyle</span>
      </>
    ),
    subheading: "From gadgets to fashion and everyday essentials, browse a wide range of listings tailored to your needs, all in one simple, fast, and reliable marketplace.",
    images: [HERO_IMAGES[1], HERO_IMAGES[2]], // Side-by-Side
  },
  {
    title: (
      <>
        Sell <span className="text-emerald-500">Faster</span> Reach <span className="text-emerald-500">More</span> People
      </>
    ),
    subheading: "List your products in minutes, connect with real buyers, and grow your business with tools designed to make selling smooth and secure.",
    images: [HERO_IMAGES[3]],
  }
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // 5 Seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden overflow-x-hidden min-h-[620px] lg:min-h-0">

      {/* PERMANENT FAINTED BACKGROUND */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] sm:opacity-[0.18]"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dgjyfvtph/image/upload/v1775037719/mapHeroImagebackground_foq9rd.png')",
          backgroundPosition: "center 20%",
          backgroundSize: "65% auto",
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-2 sm:pt-8 lg:pt-24 pb-12 lg:pb-16 mt-0 lg:mt-0">

        {/* MOBILE CAROUSEL */}
        <div className="absolute inset-0 flex justify-center lg:hidden pointer-events-none -translate-y-8">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${(i === index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div className="relative w-full h-full flex justify-center items-center">
                {slide.images.length === 1 ? (
                  <Image
                    src={slide.images[0]}
                    alt={`Hero Slide ${i}`}
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                ) : (
                  <div className="relative w-full flex justify-center items-end px-4">
                    <div className="relative w-1/2 h-[320px] z-20 -mr-20">
                      <Image
                        src={slide.images[0]}
                        alt="Woman"
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                    <div className="relative w-1/2 h-[280px] z-10">
                      <Image
                        src={slide.images[1]}
                        alt="Man"
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent backdrop-blur-[1px] z-10" />
        </div>

        {/* CONTENT */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 min-h-[500px] lg:min-h-[520px]">

          <div className="relative z-20 max-w-[680px] mx-auto text-center lg:mx-0 lg:text-left order-2 lg:order-1 pt-80 sm:pt-96 lg:pt-0">
            {/* HEADING with Animation - Restructured to prevent button overlap */}
            <div className="grid grid-cols-1 grid-rows-1">
              {SLIDES.map((slide, i) => (
                <div 
                  key={i} 
                  className={`col-start-1 row-start-1 transition-all duration-1000 ease-in-out ${(i === index) ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"}`}
                >
                  <h1 className="font-black text-black tracking-tight leading-[1.1] text-[32px] sm:text-[48px] lg:text-[60px] xl:text-[70px]">
                    {slide.title}
                  </h1>
                  <p className="mt-8 max-w-[540px] mx-auto lg:mx-0 text-[15px] sm:text-[17px] lg:text-[19px] font-medium leading-[1.6] text-zinc-900/80 line-clamp-2 md:line-clamp-3">
                    {slide.subheading}
                  </p>
                </div>
              ))}
            </div>

            {/* BUTTONS - Now correctly positioned below the grid stack */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/vendor-dashboard/add-product"
                className="
                  w-full sm:w-auto
                  bg-[#f45c03] hover:bg-black
                  text-white font-bold text-[16px]
                  px-10 py-4
                  rounded-xl
                  shadow-xl
                  hover:-translate-y-0.5
                  transition-all duration-300 cursor-pointer
                "
              >
                Start Selling Today!
              </Link>

              <Link
                href="/search"
                className="
                  hidden sm:inline-flex
                  items-center justify-center
                  w-14 h-14 rounded-full
                  border-2 border-zinc-200
                  bg-white hover:border-[#f45c03]
                  text-zinc-400 hover:text-[#f45c03]
                  transition-all duration-300
                  cursor-pointer group
                "
              >
                <span className="text-xl group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* DESKTOP CAROUSEL (RIGHT SIDE) */}
          <div className="relative w-full h-[580px] pointer-events-none hidden lg:block z-0 order-1 lg:order-2">
            <div className="relative w-full h-full overflow-visible">
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${(i === index) ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                >
                  {slide.images.length === 1 ? (
                    <Image
                      src={slide.images[0]}
                      alt={`Hero Slide ${i}`}
                      fill
                      priority={i === index}
                      className="object-contain object-top drop-shadow-2xl"
                    />
                  ) : (
                    <div className="relative w-full h-full flex justify-center items-end">
                      <div className="relative w-full h-full flex items-end justify-center overflow-visible">
                        <div className="relative w-1/2 h-[110%] -mr-48 translate-y-6 z-20">
                           <Image
                            src={slide.images[0]}
                            alt="Woman"
                            fill
                            className="object-contain object-bottom"
                          />
                        </div>
                        <div className="relative w-1/2 h-[100%] z-10">
                          <Image
                            src={slide.images[1]}
                            alt="Man"
                            fill
                            className="object-contain object-bottom"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Refined gradient masks */}
              <div className="absolute inset-y-0 left-0 w-[200px] bg-gradient-to-r from-white via-white/20 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
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

