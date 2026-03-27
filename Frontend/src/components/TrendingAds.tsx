"use client";
import { useEffect, useState } from "react";
import AdCard, { AdItem } from "./ui/AdCard";
import { listTrendingAds } from "@/services/ads.service";

export default function TrendingAds() {
  const [list, setList] = useState<AdItem[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await listTrendingAds();
        const mapped: AdItem[] = (res.data || []).slice(0, 8).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || d.city || "Nigeria",
          condition: d.condition || "Brand New",
        }));
        setList(mapped);
      } catch (err) {
        console.error("Failed to fetch trending ads:", err);
      }
    })();
  }, []);
  return (
    <>
      <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16">
        <h3 className="text-3xl font-extrabold text-[#FF6B35] mb-6">Trending Ads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
          {list.map((it) => (
            <AdCard key={it.id} item={it} />
          ))}
        </div>
      </section>
    </>
  );
}
