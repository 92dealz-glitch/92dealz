"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryBar from "./CategoryBar";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";

// Hero images – transparent PNG cutouts
const HERO_IMAGES = [
  "/images/hero_male.png",
  "/images/hero_female.png",
];

const SLIDES = [
  {
    title: (
      <>
        Connecting <span className="text-[#708238]">Smart</span> Buyers and <span className="text-[#708238]">Sellers</span> Across Pakistan
      </>
    ),
    subheading:
      "Buy, Sell & Discover everything You need, a convenient space where buyers and sellers meet, trade safely, and find value in every category with ease.",
    images: ["/images/heroimage4.png"],
  },
  {
    title: (
      <>
        Explore Deals That <span className="text-[#708238]">Match</span> Your <span className="text-[#708238]">Lifestyle</span>
      </>
    ),
    subheading:
      "From gadgets to fashion and everyday essentials, browse a wide range of listings tailored to your needs, all in one simple, fast, and reliable marketplace.",
    // Male front, Female behind – side‑by‑side layout for the hero image
    images: ["/images/heroimage5.png", "/images/heroimage6%20copy.png"],
  },
  {
    title: (
      <>
        Sell <span className="text-[#708238]">Faster</span> Reach <span className="text-[#708238]">More</span> People
      </>
    ),
    subheading:
      "List your products in minutes, connect with real buyers, and grow your business with tools designed to make selling smooth and secure.",
    images: ["/images/heroimage3.png"],
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { showVendorUpgrade } = useAlert();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
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
    <section className="relative bg-[linear-gradient(135deg,#F8F4EE_0%,#EFE4D6_50%,#DDE5CF_100%)] overflow-x-hidden min-h-[620px] lg:min-h-0">
      {/* Ambient glowing shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C7A27C]/12 blur-[80px] animate-float-slow" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full bg-[#708238]/6 blur-[100px] animate-float-delayed" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#1C1C1C 1.5px, transparent 1.5px)", backgroundSize: "24px 24px" }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-0 sm:pt-8 lg:pt-24 pb-12 lg:pb-16">
        {/* Mobile carousel */}
        <div className="absolute inset-0 flex justify-center lg:hidden pointer-events-none -translate-y-8">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${(i === index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 invisible pointer-events-none"}`}
            >
              <div className="relative w-full h-full flex justify-center items-center">
                {slide.images.length === 1 ? (
                  <img src={slide.images[0]} alt={`Hero Slide ${i}`} className={`w-[400px] h-[400px] object-contain transition-all duration-1000 ${slide.images[0] === '/images/heroimage4.png' ? 'scale-[0.90]' : ''}`} />
                ) : (
                  <div className="relative w-full h-[500px] flex justify-center items-end overflow-visible">
                    {/* Male (front) */}
                    <div className="absolute left-0 bottom-0 w-[60%] h-full z-20 translate-x-[-5%] transition-transform">
                      <Image src={slide.images[0]} alt="Male" fill priority={true} className="object-contain object-bottom" />
                    </div>
                    {/* Female (behind) */}
                    <div className="absolute right-0 bottom-0 w-[85%] h-full z-10 translate-x-[5%] transition-transform opacity-90">
                      <Image src={slide.images[1]} alt="Female" fill priority={true} className="object-contain object-bottom" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent backdrop-blur-[1px] z-10" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 min-h-[500px] lg:min-h-[520px]">
          <div className="relative z-20 max-w-[680px] mx-auto text-center lg:mx-0 lg:text-left order-2 lg:order-1 pt-80 sm:pt-96 lg:pt-0 bg-[#FFFDF9] p-8 rounded-lg">
            <div className="grid grid-cols-1 grid-rows-1">
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`col-start-1 row-start-1 transition-all duration-1000 ease-in-out ${(i === index) ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 invisible pointer-events-none"}`}
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
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={handleSellClick}
                className="w-full sm:w-auto bg-[#708238] hover:bg-[#5E6E2F] text-white font-bold text-[16px] px-10 py-4 rounded-xl shadow-lg shadow-emerald-950/10 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/15 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Start Selling Today!
              </button>
              <Link
                href="/search"
                className="hidden sm:inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-zinc-200 bg-white hover:border-[#708238] text-zinc-400 hover:text-[#708238] transition-all duration-300 cursor-pointer group"
              >
                <span className="text-xl group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          </div>

          {/* Desktop carousel (right side) */}
          <div className="relative w-full h-[580px] pointer-events-none hidden lg:block z-0 order-1 lg:order-2">
            <div className="relative w-full h-full overflow-visible">
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-[1000ms] ease-in-out ${(i === index) ? "opacity-100 scale-100" : "opacity-0 scale-95 invisible pointer-events-none"}`}
                >
                  {slide.images.length === 1 ? (
                    <img src={slide.images[0]} alt={`Hero Slide ${i}`} className={`absolute inset-0 w-full h-full object-contain object-top drop-shadow-2xl transition-all duration-1000 ${slide.images[0] === '/images/heroimage4.png' ? 'scale-[0.93] lg:scale-[0.95]' : ''}`} />
                  ) : (
                    <div className="relative w-full h-full flex justify-center items-end overflow-visible">
                      {/* Male (front) */}
                      <div className="relative w-[55%] h-[250%] -mr-[40%] z-20 translate-x-[-5%]">
                        <Image src={slide.images[0]} alt="Male" fill priority={true} className="object-contain object-bottom" />
                      </div>
                      {/* Female (behind) */}
                      <div className="relative w-[70%] h-[250%] z-10 translate-x-[5%] opacity-90">
                        <Image src={slide.images[1]} alt="Female" fill priority={true} className="object-contain object-bottom" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Gradient masks */}
              <div className="absolute inset-y-0 left-0 w-[200px] bg-gradient-to-r from-white via-white/20 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-2 border-t border-zinc-100">
          <CategoryBar />
        </div>
      </div>
    </section>
  );
}
