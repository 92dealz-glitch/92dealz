"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listFeaturedAds } from "@/services/ads.service";
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
  condition?: string;
  plan_type?: string;
};

export default function FeaturedAds() {
  const [featured, setFeatured] = useState<FeaturedAdItem[]>([]);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    (async () => {
      try {
        const res = await listFeaturedAds();
        const rawData = res.data || [];
        const mappedData = rawData.map((d: any) => ({
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
          plan_type: d.plan_type,
          condition: d.condition || "New"
        }));

        // Filter for "star" or "premium" ads, then take 4 random ones
        const filtered = mappedData.filter((it: any) => 
          it.plan_type === "star" || it.plan_type === "premium"
        );

        // Fallback to all if no star/premium found (to avoid empty section during dev)
        const pool = filtered.length > 0 ? filtered : mappedData;
        
        setFeatured(pool.sort(() => Math.random() - 0.5).slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured ads", err);
      }
    })();
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-10 text-center sm:text-left">
      <div className="flex items-center gap-5 mb-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f45c03] uppercase tracking-tight">Featured Ads</h3>
        <div className="h-0.5 flex-1 bg-[#f45c03] opacity-20 shadow-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left">
        {featured.map((it) => {
          const fav = isFavorite(it.id);
          return (
            <div key={it.id} className="bg-white rounded-[2rem] border-2 border-[#f45c03]/60 shadow-sm flex flex-col transition-all hover:shadow-md relative overflow-hidden h-full group">
              {/* IMAGE SECTION */}
              <div className="w-full aspect-[1.4/1] relative overflow-hidden shrink-0">
                <Image
                  src={it.img}
                  alt={it.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* VERIFIED BADGE */}
                {it.isVerified && (
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#10b981] text-white px-3 py-1.5 rounded-full shadow-sm">
                    <div className="bg-white rounded-full p-0.5">
                       <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5 text-[#10b981]" xmlns="http://www.w3.org/2000/svg">
                         <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                    <span className="text-[10px] font-black tracking-wider uppercase">Verified</span>
                  </div>
                )}

                {/* FAVORITE BUTTON */}
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
                  className={`absolute top-4 right-4 z-20 bg-white rounded-xl p-2.5 shadow-md transition-all hover:scale-110 ${fav ? 'text-red-500' : 'text-zinc-800'}`}
                >
                  <Heart size={20} fill={fav ? "currentColor" : "none"} />
                </button>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-lg sm:text-xl font-black text-[#f45c03] leading-none">{it.price}</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{it.condition || "New"}</span>
                </div>

                <div className="flex flex-col gap-0.5 mt-1.5">
                   <h4 className="font-bold text-zinc-900 line-clamp-2 text-sm sm:text-[15px] leading-tight break-words">
                     {it.title}
                   </h4>
                   <div className="flex items-center gap-1 w-fit bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100 mt-0.5">
                      <span className="text-yellow-500 text-[9px]">★</span>
                      <span className="text-[9px] font-bold text-zinc-700">{it.rating > 0 ? it.rating.toFixed(1) : "4.9"}</span>
                   </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-zinc-50">
                  <div className="flex items-center gap-1.5 text-zinc-400 font-bold max-w-[60%] truncate">
                    <MapPin size={12} className="shrink-0" />
                    <span className="text-[10px] truncate">{[it.city, it.state].filter(Boolean).join(", ") || it.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400 font-bold">
                    <span className="text-[10px]">{it.views.toLocaleString()} views</span>
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
          className="bg-white border-2 border-[#f45c03] px-10 py-3.5 rounded-full font-black shadow-sm text-[#f45c03] hover:bg-[#f45c03] hover:text-white transition-all text-base tracking-wider uppercase"
        >
          View More Promoted Ads
        </Link>
      </div>
    </section>
  );
}
