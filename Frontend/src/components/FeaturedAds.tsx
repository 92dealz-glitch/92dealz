"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listActiveAds } from "@/services/ads.service";
import { Heart, MapPin, Flame } from "lucide-react";
import { useFavorites } from "@/context/FavoritesProvider";

export type FeaturedAdItem = {
  id: number | string;
  price: string;
  title: string;
  desc: string;
  img: string;
  location: string;
  state?: string;
  city?: string;
  views: number;
  rating: number;
  isVerified: boolean;
};

export default function FeaturedAds() {
  const [featured, setFeatured] = useState<FeaturedAdItem[]>([]);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds();
        const data = (res.data || []).slice(0, 4).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          img: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || "Nigeria",
          state: d.state,
          city: d.city,
          views: d.clicks || 0,
          rating: Number(d.rating || 0),
          isVerified: d.is_verified || d.User?.is_verified || false,
        }));
        setFeatured(data);
      } catch (err) {
        console.error("Failed to fetch featured ads", err);
      }
    })();
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-10 text-center sm:text-left">
      <div className="flex items-center gap-5 mb-10">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#f45c03] uppercase tracking-tight">Featured Ads</h3>
        <div className="h-0.5 flex-1 bg-[#f45c03] opacity-40 shadow-sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 auto-rows-[1fr] items-stretch">
        {featured.map((it) => {
          const fav = isFavorite(it.id);
          return (
            <div key={it.id} className="bg-[#f45c03] rounded-[32px] p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row gap-6 items-center transition-all hover:scale-[1.01] relative group">
              {/* IMAGE SECTION */}
              <div className="w-full sm:w-[45%] aspect-square relative bg-white border-[6px] border-white rounded-[24px] overflow-hidden shrink-0 shadow-lg">
                <Image
                  src={it.img}
                  alt={it.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggle({
                      id: it.id,
                      title: it.title,
                      price: it.price,
                      img: it.img,
                      desc: it.desc,
                      location: it.location,
                      likes: it.views,
                    });
                  }}
                  className={`absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md transition-transform hover:scale-110 ${fav ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart size={20} fill={fav ? "currentColor" : "none"} />
                </button>
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 text-white w-full">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-2xl sm:text-3xl font-black">{it.price}</span>
                       {it.isVerified && (
                         <div className="bg-emerald-400 text-white rounded-full p-1 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white stroke-emerald-400 stroke-2">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                         </div>
                       )}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold leading-tight mb-2 line-clamp-2">{it.title}</h4>
                  </div>
                </div>

                <p className="text-white/80 text-sm mb-4 line-clamp-2 sm:line-clamp-3 font-medium">
                  {it.desc || "No description provided for this premium deal."}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-1 mb-6 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < Math.floor(it.rating || 5) ? '★' : '☆'}
                    </span>
                  ))}
                  {it.rating > 0 && <span className="ml-2 font-bold text-white">({Number(it.rating).toFixed(1)})</span>}
                </div>

                  <div className="flex items-center justify-between mt-auto border-t border-white/20 pt-4">
                    <div className="flex items-center gap-1.5 text-white/90 font-bold max-w-[60%] truncate" title={`${it.city ? it.city + ", " : ""}${it.state ? it.state + ", " : ""}${it.location}`}>
                      <MapPin size={16} />
                      <span className="text-sm truncate">{[it.city, it.state, it.location].filter(Boolean).join(", ")}</span>
                    </div>
                  <div className="flex items-center gap-1.5 text-white/90 font-bold">
                    <Flame size={18} className="text-yellow-300" />
                    <span className="text-sm">{it.views} views</span>
                  </div>
                </div>
              </div>

              <Link href={`/product/${it.id}`} className="absolute inset-0 z-10" aria-label={`View ${it.title}`} />
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 flex justify-center">
        <Link 
          href="/search"
          className="bg-[#f45c03] border-2 border-white/20 px-8 py-3.5 rounded-2xl font-black shadow-xl text-white hover:bg-white hover:text-[#f45c03] transition-all text-base tracking-wider uppercase"
        >
          Explore Premium Deals
        </Link>
      </div>
    </section>
  );
}

