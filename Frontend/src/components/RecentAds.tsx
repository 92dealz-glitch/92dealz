"use client";
import { useEffect, useState } from "react";
import AdCard, { AdItem } from "./ui/AdCard";
import { listActiveAds } from "@/services/ads.service";
import { useLocationFilter } from "@/context/LocationFilterContext";

export default function RecentAds() {
  const [list, setList] = useState<AdItem[]>([]);
  const { filter } = useLocationFilter();

  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds({ 
          limit: 50, 
          sort: "created_at", 
          dir: "desc",
          location: filter.country !== "All" ? filter.country : undefined,
          state: filter.state || undefined,
          city: filter.city || undefined
        });
        const allMapped: AdItem[] = (res.data || []).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          priceValue: Number(d.price),
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || "Nigeria",
          state: d.state,
          city: d.city,
          condition: d.condition || "New",
          likes: d.clicks || 0,
          rating: Number(d.rating || 0),
          isVerified: d.is_verified || d.User?.is_verified || false,
        }));
        
        // Filter to only show verified vendors in this section
        const verifiedOnly = allMapped.filter(item => item.isVerified).slice(0, 8);
        setList(verifiedOnly);
      } catch (err) {
        console.error("Failed to fetch recent ads:", err);
      }
    })();
  }, [filter]);
  if (!list.length) return null;
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-8">
      <h3 className="text-3xl font-extrabold text-[#f45c03] mb-6">Recent Ads</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {list.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}


