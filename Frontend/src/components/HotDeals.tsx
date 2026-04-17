"use client";

import Image from "next/image";
import Link from "next/link";
import { listHotDeals } from "@/services/ads.service";
import { Heart, MapPin } from "lucide-react";
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
          price: formatPrice(Number(d.price)),
          priceValue: Number(d.price),
          img: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || (d.User?.country_name || "Africa"),
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
              className="relative shrink-0 w-[160px] xs:w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] bg-white rounded-[1.2rem] sm:rounded-[1.5rem] border-2 border-[#10b981] p-2.5 shadow-sm h-full flex flex-col snap-start group"
            >
              {/* FAVORITE BUTTON */}
              {(() => {
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
                    className={`absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm hover:scale-110 transition-transform ${fav ? "text-red-500" : "text-gray-400"}`}
                  >
                    <Heart className="w-3.5 h-3.5" fill={fav ? "currentColor" : "none"} />
                  </button>
                );
              })()}

              <Link href={`/product/${item.id}`} className="block h-full">
                {/* IMAGE */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* VERIFIED BADGE ON IMAGE */}
                  {item.isVerified && (
                    <div className="absolute top-2 left-2 z-10 bg-white rounded-full p-0.5 shadow-sm">
                       <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#10b981]" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10M12 2L3 7V12C3 15.5 5.5 18.5 9 19.5L12 21L15 19.5C18.5 18.5 21 15.5 21 12V7L12 2Z" 
                            fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                  )}
                </div>

                {/* INFO SECTION */}
                <div className="mt-2.5 flex flex-col flex-1 px-0.5">
                  <p className="text-[#f45c03] font-black text-base sm:text-lg leading-none">
                    {item.price}
                  </p>
                  <h4 className="mt-0 font-bold text-[13px] sm:text-[14px] text-zinc-900 line-clamp-1 leading-snug">
                    {item.title}
                  </h4>

                  {/* RATING: Dynamic Stars (Fallback to 5 if no rating) */}
                  <div className="mt-0.5 flex items-center gap-0.5 text-[#f45c03] leading-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[10px]">
                        {i < Math.floor(item.rating || 5) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>

                  {/* FOOTER: Location & Condition */}
                  <div className="mt-1.5 flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-zinc-500 font-bold overflow-hidden border-t border-zinc-50 pt-1.5">
                    <span className="truncate flex items-center gap-1">
                      <MapPin size={9} className="shrink-0" />
                      {item.city || item.location}
                    </span>
                    <span className="shrink-0 uppercase tracking-tighter opacity-70">{item.newLabel || "New"}</span>
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

