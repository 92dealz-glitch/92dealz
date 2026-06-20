"use client";

import Link from "next/link";
import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesProvider";
import { useCurrency } from "@/context/CurrencyContext";

export type AdItem = {
  id: number | string;
  price: string;
  priceValue?: number; // Base PKR price
  title: string;
  brand?: string;
  desc?: string;
  badge?: string;
  img?: string;
  location?: string; // This usually holds the State or Country
  state?: string;
  city?: string;
  likes?: number;
  rating?: number;
  condition?: string;
  views?: number;
  isVerified?: boolean;
  plan_type?: 'free' | 'basic' | 'star';
};

type Props = {
  item: AdItem;
  className?: string;
};

export default function AdCard({ item, className = "" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const { formatPrice } = useCurrency();
  const fav = isFavorite(item.id);

  // Helper to format location
  const displayLocation = () => {
    const parts = [];
    if (item.city) parts.push(item.city);
    if (item.state && item.state !== item.location) parts.push(item.state);
    if (item.location) parts.push(item.location);
    
    if (parts.length === 0) return "Pakistan";
    return parts.join(", ");
  };

  return (
    <Link href={`/product/${item.id}`}>
      <article
        className={
          `relative rounded-2xl border border-[#E9E0D4] p-3.5 bg-[#FFFDF9] shadow-sm hover:shadow-xl hover:shadow-[#C7A27C]/5 hover:border-[#C7A27C]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group overflow-hidden ${className}`
        }
        aria-label={`Ad ${item.title}`}
      >
        <div className="flex-none relative w-full overflow-hidden bg-zinc-50 rounded-xl">
          <div className="w-full pb-[72%] shrink-0"></div>
          {(item.badge || item.img) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.badge || item.img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform group-hover:scale-105"
            />
          ) : null}

          {/* Heart button: positioned top-right over the image */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle({
                id: item.id,
                title: item.title,
                priceValue: item.priceValue,
                price: item.price,
                img: item.badge || item.img,
                desc: item.desc,
                location: item.location,
                likes: item.likes ?? 0,
              });
            }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className={`absolute right-1 top-1 z-20 bg-[#FFFDF9]/90 backdrop-blur-sm rounded-full p-1 shadow ${fav ? "text-red-500" : "text-gray-400"}`}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2.5 px-0.5 text-left flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p className={`text-[#708238] font-extrabold leading-tight break-all ${
              (item.price || "").length > 12 ? "text-[12px] sm:text-[14px]" : "text-[15px] sm:text-lg"
            }`}>
              {item.priceValue ? formatPrice(item.priceValue) : item.price}
            </p>
            <h4 className="mt-1 font-bold text-black text-[13px] sm:text-[16px] line-clamp-2 leading-tight break-words">{item.title}</h4>
          </div>

          {item.isVerified && (
            <div className="shrink-0 mt-0.5" title="Verified Vendor">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#C7A27C" />
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
        
        <div className="mt-1 px-0.5 space-y-1.5 pb-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 shrink-0">
              {item.rating && item.rating > 0 ? (
                <div className="flex items-center text-yellow-400">
                  <div className="flex items-center text-base leading-none">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="drop-shadow-sm">{i <= Math.floor(item.rating || 0) ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="ml-1 text-black font-extrabold text-[10px] sm:text-xs">({Number(item.rating).toFixed(1)})</span>
                </div>
              ) : (
                <span className="text-gray-400 italic text-[9px] sm:text-[10px]">No reviews</span>
              )}
            </div>
            <div className="text-[9px] sm:text-[10px] text-gray-500 font-bold bg-zinc-100 px-2 py-0.5 rounded-md shrink-0">
              {item.condition || "New"}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[12px] text-gray-500 pt-1 border-t border-gray-50">
            <div className="truncate font-semibold flex-1" title={displayLocation()}>
               📍 {displayLocation()}
            </div>
            <span className="text-[#708238] font-bold whitespace-nowrap shrink-0">{item.views ?? item.likes ?? 0} views</span>
          </div>
        </div>
      </article>
    </Link>
  );
}


