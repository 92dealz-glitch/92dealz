"use client";

import Link from "next/link";
import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesProvider";

export type AdItem = {
  id: number | string;
  price: string;
  priceRaw?: number;
  title: string;
  brand?: string;
  desc?: string;
  badge?: string;
  img?: string;
  location?: string;
  likes?: number;
  rating?: number;
  condition?: string;
  views?: number;
  isVerified?: boolean;
};

type Props = {
  item: AdItem;
  className?: string;
};

export default function AdCard({ item, className = "" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(item.id);
  return (
    <Link href={`/product/${item.id}`}>
      <article
        className={
          `relative rounded-2xl border border-emerald-500/30 p-3 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden ${className}`
        }
        aria-label={`Ad ${item.title}`}
      >
        <div className="flex-none relative w-full rounded-md overflow-hidden border border-zinc-100">
          <div className="w-full pb-[66%]"></div>
          {(item.badge || item.img) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.badge || item.img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : null}

          {item.isVerified && (
            <div className="absolute top-2 left-2 z-20 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-sm flex items-center gap-1">
              <span>✓</span>
              <span className="hidden sm:inline">Verified</span>
            </div>
          )}

          {/* Heart button: positioned top-right over the image */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle({
                id: item.id,
                title: item.title,
                price: item.price,
                img: item.badge || item.img,
                desc: item.desc,
                location: item.location,
                likes: item.likes ?? 0,
              });
            }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className={`absolute right-2 top-2 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow ${fav ? "text-red-500" : "text-gray-400"}`}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 flex-1 min-h-[50px]">
          <p className="text-orange-600 font-extrabold text-[13px] sm:text-base">{item.price}</p>
          <h4 className="mt-0.5 font-bold text-black text-[12px] sm:text-sm sm:line-clamp-2 leading-tight break-words">{item.title}</h4>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-1 shrink-0">
            {item.rating && item.rating > 0 ? (
              <div className="flex items-center text-yellow-400">
                <div className="flex items-center text-lg leading-none">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="drop-shadow-sm">{i <= Math.floor(item.rating || 0) ? "★" : "☆"}</span>
                  ))}
                </div>
                <span className="ml-1.5 text-black font-extrabold text-xs sm:text-sm">({Number(item.rating).toFixed(1)})</span>
              </div>
            ) : (
              <span className="text-gray-400 italic text-[10px] sm:text-xs">No reviews</span>
            )}
          </div>

          <div className="text-[10px] sm:text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-full break-words text-center min-w-[40px] shrink-0">
            {item.condition === "Brand New" ? "New" : (item.condition ?? "New")}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2 text-[10px] sm:text-xs text-gray-600 border-t border-gray-50 pt-2">
          <div className="break-all max-w-[80px] sm:max-w-none shrink">{item.location ?? "Nigeria"}</div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-orange-500 font-bold">{item.views ?? item.likes ?? 0} <span>views</span></span>
          </div>
        </div>
      </article>
    </Link>
  );
}
