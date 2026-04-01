"use client";
import { useEffect, useState } from "react";
import { listActiveAds } from "@/services/ads.service";
import AdCard, { AdItem } from "./ui/AdCard";

export default function FeaturedAds() {
  const [featured, setFeatured] = useState<AdItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds();
        const data = (res.data || []).slice(0, 4).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || "Nigeria",
          views: d.clicks || 0,
          rating: Number(d.rating || 0),
          condition: d.condition || "Featured",
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
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-20 mt-10">
      <div className="flex items-center gap-5 mb-10">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#f45c03] uppercase tracking-tight">Featured Ads</h3>
        <div className="h-0.5 flex-1 bg-[#f45c03] opacity-40 shadow-sm" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 auto-rows-[1fr] items-stretch">
        {featured.map((it) => (
          <div key={it.id} className="p-1 sm:p-2 bg-[#f45c03] rounded-[30px] shadow-2xl transition-all hover:-translate-y-2 group">
            <div className="bg-white rounded-[24px] overflow-hidden h-full">
              <AdCard 
                item={it} 
                className="!border-none !shadow-none !p-2 sm:!p-4"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-14 flex justify-center">
        <button className="bg-[#f45c03] px-16 py-4.5 rounded-2xl font-black shadow-xl shadow-orange-100 text-white hover:scale-105 active:scale-95 transition-all text-xl tracking-wider">
          Explore Premium Deals
        </button>
      </div>
    </section>
  );
}

