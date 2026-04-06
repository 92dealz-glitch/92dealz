"use client";
import { useEffect, useState } from "react";
import AdCard, { AdItem } from "./ui/AdCard";
import { listActiveAds } from "@/services/ads.service";
import { getMyProfile } from "@/lib/api";
import { useLocationFilter } from "@/context/LocationFilterContext";

export default function Recommended() {
  const [items, setItems] = useState<AdItem[]>([]);
  const [title, setTitle] = useState("Recommended for you.");
  const { filter } = useLocationFilter();

  useEffect(() => {
    (async () => {
      try {
        let categoryName = undefined;
        let isRandom = true;

        // Try to get user preferences
        try {
          const profile = await getMyProfile();
          const profileData = profile.data as any;
          if (profile.success && profileData.poll_category && profileData.last_poll_date) {
            const lastDate = new Date(profileData.last_poll_date);
            const now = new Date();
            const diffDays = Math.floor(Math.abs(now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays < 7) {
              categoryName = profileData.poll_category;
              setTitle(`Recommended ${categoryName} for you.`);
              isRandom = false;
            } else {
              setTitle("Freshly Picked for you.");
            }
          }
        } catch (_) {
          // Fallback to random for guest users
          setTitle("Recommended Discovery.");
        }

        const res = await listActiveAds({
          limit: 8,
          category_name: categoryName,
          // @ts-ignore - added random support in backend
          random: isRandom ? 'true' : undefined,
          location: filter.country !== "All" ? filter.country : undefined,
          state: filter.state || undefined,
          city: filter.city || undefined
        });
        const mapped: AdItem[] = (res.data || []).slice(0, 8).map((d: any) => ({
          id: d.id,
          price: `₦ ${Number(d.price).toLocaleString()}`,
          title: d.title,
          desc: d.description || "",
          badge: d.image_url || "/assets/images/bgphone.svg",
          location: d.location || d.city || "Nigeria",
          condition: d.condition || "New",
          views: d.clicks || 0,
          rating: d.rating || 0,
          isVerified: d.is_verified || d.User?.is_verified || false,
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
      <h3 className="text-3xl font-extrabold text-[#f45c03] mb-6">Recommended for you.</h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
        {items.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>

    </section>
  );
}

