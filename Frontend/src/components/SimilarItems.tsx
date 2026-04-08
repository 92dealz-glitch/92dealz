"use client";
import AdCard, { AdItem } from "./ui/AdCard";
import { useEffect, useState } from "react";
import { listActiveAds } from "@/services/ads.service";

export default function SimilarItems() {
  const [items, setItems] = useState<AdItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds();
        const mapped: AdItem[] = (res.data || []).slice(0, 4).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || "Nigeria",
          state: d.state,
          city: d.city,
          condition: d.condition || "Used",
          isVerified: d.is_verified || d.User?.is_verified || false,
        }));
        setItems(mapped);
      } catch (err) {
        console.error("Failed to fetch similar items", err);
      }
    })();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 lg:px-0 pb-12 pt-5">
      <h3 className="text-2xl font-extrabold text-[#f45c03] mb-6">Similar Items You May Like</h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr] items-stretch">
        {items.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}

