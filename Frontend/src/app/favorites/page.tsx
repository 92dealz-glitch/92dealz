"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Heart as HeartIcon } from "lucide-react";
import { useFavorites } from "../../context/FavoritesProvider";

export default function FavoritesPage() {
  const { items, toggle, isFavorite } = useFavorites();

  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Recently Saved");

  return (
    <>
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-[#FF6B35]">
              My Favourites
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {items.length} items saved
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 rounded-md border border-orange-300 text-orange-600 font-semibold">
              Bulk Select
            </button>

            {/* SORT DROPDOWN */}
            <div className="flex items-center gap-2 relative">
              <span className="text-sm text-gray-600">Sort By:</span>

              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="bg-orange-500 text-white px-4 py-2 rounded-md"
              >
                {sortOption}
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-md shadow-lg z-50">
                  {[
                    "Recently Saved",
                    "Highest Price",
                    "Lowest Price",
                    "Seller Rating",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setSortOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="min-h-[56vh] flex flex-col items-center justify-center">
            <div className="max-w-[720px] w-full text-center">
              <div className="flex justify-center mb-6">
                <Image
                  src="/assets/images/emptyiconforfavoritepage.svg"
                  alt="No favourites"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FF6B35] mb-3">
                No favourites yet
              </h2>
              <p className="text-base text-gray-600">
                Save items you like so you can easily find them later.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((it) => (
              <article
                key={it.id}
                className="relative rounded-lg border-2 border-emerald-300 p-3 bg-white shadow-sm ring-inset hover:ring-2 hover:ring-orange-200 transition-all"
              >
                <div className="absolute top-3 right-3 z-10">
                  <button
                    aria-label={
                      isFavorite(it.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    onClick={() => toggle(it)}
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
                  >
                    <HeartIcon
                      size={16}
                      className={
                        isFavorite(it.id) ? "text-red-500" : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                <Link href={`/product/${it.id}`} className="block group">
                  <div className="w-full h-44 rounded-md overflow-hidden mb-3 bg-gray-50 relative">
                    {it.img ? (
                      <Image
                        src={it.img}
                        alt={String(it.title)}
                        width={600}
                        height={360}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <p className="text-amber-600 font-extrabold">
                        {it.price}
                      </p>
                    </div>

                    <h3 className="mt-2 font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                      {it.title}
                    </h3>

                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                      {it.desc}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        📍 <span>{it.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        👍{" "}
                        <span className="font-semibold">
                          {it.likes ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
}