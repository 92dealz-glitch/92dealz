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
          `relative rounded-2xl border border-gray-100 p-3 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group ${className}`
        }
        aria-label={`Ad ${item.title}`}
      >
        <div className="flex-none relative w-full rounded-md overflow-hidden border border-gray-100">
          <div className="w-full pb-[66%]"></div>
          {(item.badge || item.img) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.badge || item.img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
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
          <h4 className="mt-0.5 font-bold text-black text-[12px] sm:text-sm line-clamp-1 sm:line-clamp-2 leading-tight">{item.title}</h4>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-0.5 text-[10px] sm:text-xs">
            {item.rating && item.rating > 0 ? (
              <>
                <span className="font-bold text-black mr-0.5">{Number(item.rating).toFixed(1)}</span>
                <span className="text-yellow-400">★</span>
              </>
            ) : (
              <span className="text-gray-400 italic">No reviews</span>
            )}
          </div>

          <div className="text-[10px] sm:text-xs text-gray-500 font-medium">{item.condition ?? "Brand New"}</div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs text-gray-600 border-t border-gray-50 pt-2">
          <div className="truncate max-w-[60px] sm:max-w-none">{item.location ?? "Nigeria"}</div>
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-bold">{item.views ?? item.likes ?? 0} <span className="hidden sm:inline">views</span></span>
          </div>
        </div>
      </article>
    </Link>
  );
}
