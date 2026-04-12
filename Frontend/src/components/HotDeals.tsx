"use client";

import Image from "next/image";
import Link from "next/link";
import { listHotDeals } from "@/services/ads.service";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesProvider";

interface HotDeal {
  id: number;
  title: string;
  price: string;
  priceValue?: number;
  img: string;
  location: string;
  state?: string;
  city?: string;
  newLabel?: string;
  isVerified?: boolean;
  rating?: number;
  views?: number;
}

import { useEffect, useState, useRef } from "react";
import { useLocationFilter } from "@/context/LocationFilterContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function HotDeals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<HotDeal[]>([]);
  const { filter } = useLocationFilter();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    (async () => {
      try {
        const res = await listHotDeals();
        const mapped: HotDeal[] = (res.data || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          priceValue: Number(d.price),
          img: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || "Nigeria",
          state: d.state,
          city: d.city,
          newLabel: d.condition || "New",
          isVerified: d.is_verified || d.User?.is_verified || false,
          rating: Number(d.rating || 0),
          views: d.clicks || 0,
        }));
        setList(mapped);
      } catch (err) {}
    })();
  }, [filter]);

  const { isFavorite, toggle } = useFavorites();

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 mt-10">
      {/* HEADER */}
      <div className="relative flex items-center mb-10">
        <h3
          className="absolute left-1/2 -translate-x-1/2 
  whitespace-nowrap 
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
  font-extrabold text-black text-center"
        >
          Hot Deals <span className="text-[#ff7a2d]">Today!</span>
        </h3>

        <div className="ml-auto hidden md:flex">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-[#ff7a2d] transition"
          >
            See more
          </a>
        </div>
      </div>

      {/* CAROUSEL on lg, mobile-first: 2-column grid */}
      <div className="relative">
        {/* LEFT CHEVRON */}
        <button
          aria-label="Scroll left"
          onClick={scrollLeft}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-[#ff7a2d] w-14 h-14 rounded-full items-center justify-center text-white shadow-lg hover:bg-[#ff7a2d] transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* SCROLL CONTAINER: grid on mobile (2 cols, equal rows), carousel on lg */}
        <div
          ref={scrollRef}
          className={
            "flex gap-4 overflow-x-auto pt-6 pb-6 scroll-smooth snap-x snap-mandatory lg:gap-6 " +
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          }
        >
          {list.map((item) => (
            <div
              key={item.id}
              className="relative shrink-0 w-[260px] sm:w-[240px] md:w-[260px] lg:min-w-[260px] bg-white rounded-[24px] border-2 border-[#ff7a2d] p-1.5 pb-5 shadow-sm h-full flex flex-col snap-start group"
            >
              {/* HOT BADGE */}
              <div className="absolute -top-3 left-2 z-30 pointer-events-none">
                <div className="bg-[#ff7a2d] text-white text-[11px] font-black px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-md">
                  Hot 🔥
                </div>
              </div>

                  {/* HEART */}
                  {
                    (() => {
                      const fav = isFavorite(item.id);
                      return (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggle({
                              id: item.id,
                              title: item.title,
                              priceValue: item.priceValue,
                              price: item.price,
                              img: item.img,
                              desc: undefined,
                              location: item.location,
                              likes: 0,
                            });
                          }}
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          className={`absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow hover:scale-110 active:scale-95 transition-transform ${fav ? "text-red-500" : "text-gray-400"}`}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      );
                    })()
                  }

              <Link href={`/product/${item.id}`} className="block h-full">
                {/* IMAGE */}
                <div className="mt-2 relative flex-none">
                  <div className="bg-[#F7F7F7] rounded-2xl p-1 shadow-md transition-transform group-hover:rotate-[-2deg] sm:group-hover:rotate-[-3deg]">
                    <div className="relative w-full pb-[75%] sm:pb-[70%] lg:pb-0 lg:h-[220px] rounded-xl overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="absolute inset-0 object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Verified Badge removed from here and moved next to price below */}
                    </div>
                  </div>
                </div>

                {/* PRICE & TITLE */}
                <div className="mt-2 text-left flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className={`text-[#ff7a2d] font-extrabold break-all ${
                      (item.price || "").length > 12 ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                    }`}>
                      {item.priceValue ? formatPrice(item.priceValue) : item.price}
                    </p>
                    <h4 className="mt-1 font-semibold text-base sm:text-lg text-black line-clamp-2 group-hover:text-[#ff7a2d] transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  {item.isVerified && (
                    <div className="shrink-0 mt-1" title="Verified Vendor">
                      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#10b981" />
                        <path 
                          d="M8 12L11 15L16 9" 
                          stroke="white" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Dynamic spacer to push ratings and footer to bottom and keep card height even */}
                <div className="flex-1" />

                <div className="mt-1 px-1.5 space-y-1 pb-1">
                  {/* RATING */}
                  <div className="flex items-center gap-1 text-yellow-400">
                    {item.rating && item.rating > 0 ? (
                      <div className="flex items-center">
                        <div className="flex items-center text-base leading-none">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="drop-shadow-sm">{i <= Math.floor(item.rating || 0) ? "★" : "☆"}</span>
                          ))}
                        </div>
                        <span className="ml-1 text-black font-bold text-[10px] sm:text-xs">({Number(item.rating).toFixed(1)})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-[10px]">No reviews</span>
                    )}
                  </div>

                  {/* LOCATION & CONDITION */}
                  <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[12px] text-gray-500 pt-1.5 border-t border-gray-50">
                    <div className="truncate font-semibold flex-1" title={`${item.city ? item.city + ", " : ""}${item.state ? item.state + ", " : ""}${item.location}`}>
                      <span>📍 {[item.city, item.state, item.location].filter(Boolean).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[#ff7a2d] font-bold whitespace-nowrap">{item.views ?? 0} views</span>
                      {item.newLabel && (
                        <span className="font-bold text-[#ff7a2d] bg-orange-50 px-1.5 py-0.5 rounded-sm uppercase text-[9px]">
                          {item.newLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* RIGHT CHEVRON */}
        <button
          aria-label="Scroll right"
          onClick={scrollRight}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-[#ff7a2d] w-14 h-14 rounded-full items-center justify-center text-white shadow-lg hover:bg-[#ff7a2d] transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

