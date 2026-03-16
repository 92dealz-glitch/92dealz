"use client";

import Image from "next/image";
import { listActiveAds } from "@/services/ads.service";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesProvider";

interface HotDeal {
  id: number;
  title: string;
  price: string;
  img: string;
  location: string;
  newLabel?: string;
}

import { useEffect, useState, useRef } from "react";

export default function HotDeals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<HotDeal[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds();
        const mapped: HotDeal[] = (res.data || []).reverse().slice(0, 8).map((d: any) => ({
          id: d.id,
          title: d.title,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          img: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || "Nigeria",
          newLabel: "Brand New",
        }));
        setList(mapped);
      } catch (err) {}
    })();
  }, []);

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
          Hot Deals <span className="text-[#FF6B35]">Today!</span>
        </h3>

        <div className="ml-auto hidden md:flex">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-[#FF6B35] transition"
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
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-[#FF6B35] w-14 h-14 rounded-full items-center justify-center text-white shadow-lg hover:bg-[#FF5520] transition"
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
            "flex gap-4 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory lg:gap-6 " +
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          }
        >
          {list.map((item) => (
            <div
              key={item.id}
              className="relative shrink-0 w-[260px] sm:w-[240px] md:w-[260px] lg:min-w-[260px] bg-white rounded-[24px] border-2 border-[#FF6B35] px-4 pt-4 pb-5 shadow-sm h-full flex flex-col snap-start min-h-[320px] lg:min-h-0"
            >
              {/* HOT BADGE */}
              <div className="absolute -top-3 left-3 z-10">
                <div className="relative">
                  <div className="bg-[#FF6B35] text-white text-sm font-bold px-4 py-1.5 rounded-r-lg">
                    Hot 🔥
                  </div>
                  <div className="absolute left-0 -bottom-2 w-0 h-0 border-t-[8px] border-t-[#FF6B35] border-r-[8px] border-r-transparent" />
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
                              price: item.price,
                              img: item.img,
                              desc: undefined,
                              location: item.location,
                              likes: 0,
                            });
                          }}
                          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                          className={`absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow ${fav ? "text-red-500" : "text-gray-400"}`}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      );
                    })()
                  }

              {/* IMAGE */}
              <div className="mt-6 relative flex-none">
                <div className="bg-[#F7F7F7] rounded-2xl p-3 sm:p-6 shadow-md rotate-[-1deg] sm:rotate-[-2deg]">
                  <div className="relative w-full pb-[66%] sm:pb-[60%] lg:pb-0 lg:h-[180px]">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="absolute inset-0 object-cover"
                    />
                  </div>
                </div>

                {/* VERIFIED */}
                <div className="absolute right-0 bottom-2">
                  <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* PRICE & TITLE */}
              <div className="mt-4 flex-1">
                <p className="text-[#FF6B35] font-extrabold text-xl sm:text-2xl">
                  {item.price}
                </p>
                <h4 className="mt-1 font-semibold text-base sm:text-lg text-black line-clamp-2">
                  {item.title}
                </h4>
              </div>

              {/* RATING */}
              <div className="mt-1.5 flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#FF6B35]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z" />
                  </svg>
                ))}
                <svg
                  className="w-5 h-5 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .587l3.668 7.431L24 9.748l-6 5.858L19.335 24 12 20.201 4.665 24 6 15.606 0 9.748l8.332-1.73L12 .587z" />
                </svg>
              </div>

              {/* LOCATION */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span>📍</span>
                  <span>{item.location}</span>
                </div>
                {item.newLabel && (
                  <span className="font-medium text-gray-700">
                    {item.newLabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT CHEVRON */}
        <button
          aria-label="Scroll right"
          onClick={scrollRight}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-[#FF6B35] w-14 h-14 rounded-full items-center justify-center text-white shadow-lg hover:bg-[#FF5520] transition"
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
