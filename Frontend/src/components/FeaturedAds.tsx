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
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16 mt-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-extrabold text-[#FF6B35]">Featured Ads</h3>
        <div className="hidden sm:block h-1 flex-1 bg-gradient-to-r from-[#FF6B35]/20 to-transparent ml-8 rounded-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr] items-stretch">
        {featured.map((it) => (
          <AdCard 
            key={it.id} 
            item={it} 
            className="!border-[#FF6B35]/40 shadow-md hover:shadow-2xl hover:-translate-y-1"
          />
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <button className="bg-gradient-to-r from-[#FF6B35] to-[#E85A28] px-12 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-100 text-white hover:scale-105 active:scale-95 transition-all">
          Explore Premium Deals
        </button>
      </div>
    </section>
  );
}
