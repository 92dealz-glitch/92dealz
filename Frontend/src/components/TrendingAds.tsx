"use client";
import { useEffect, useState } from "react";
import AdCard, { AdItem } from "./ui/AdCard";
import { listTrendingAds } from "@/services/ads.service";
import { useLocationFilter } from "@/context/LocationFilterContext";

export default function TrendingAds() {
  const [list, setList] = useState<AdItem[]>([]);
  const { filter } = useLocationFilter();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await listTrendingAds({
          location: filter.country !== "All" ? filter.country : undefined,
          state: filter.state || undefined,
          city: filter.city || undefined
        });
        const mapped: AdItem[] = (res.data || []).slice(0, 8).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          priceValue: Number(d.price),
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || d.city || "Nigeria",
          condition: d.condition || "New",
          likes: d.clicks || 0,
          rating: Number(d.rating || 0),
          isVerified: d.is_verified || d.User?.is_verified || false,
        }));
        setList(mapped);
      } catch (err) {
        console.error("Failed to fetch trending ads:", err);
      }
    };

    fetchTrending();
    // Refresh every 5 minutes to keep it "live"
    const interval = setInterval(fetchTrending, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [filter]);
  return (
    <>
      <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16">
        <h3 className="text-3xl font-extrabold text-[#f45c03] mb-6">Trending Ads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
          {list.map((it) => (
            <AdCard key={it.id} item={it} />
          ))}
        </div>
      </section>
    </>
  );
}

