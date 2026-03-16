"use client";
import { useEffect, useState } from "react";
import AdCard, { AdItem } from "./ui/AdCard";
import { listActiveAds } from "@/services/ads.service";

export default function Recommended() {
  const [items, setItems] = useState<AdItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listActiveAds();
        const mapped: AdItem[] = (res.data || []).slice(0, 8).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || d.city || "Nigeria",
          condition: d.condition || "Brand New",
        }));
        setItems(mapped);
      } catch (err) {
        console.error("Failed to fetch recommended ads", err);
      }
    })();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-16">
      <h3 className="text-3xl font-extrabold text-[#FF6B35] mb-6">Recommended for you.</h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
        {items.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>

    </section>
  );
}
