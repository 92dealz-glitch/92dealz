"use client";
import AdCard, { AdItem } from "./ui/AdCard";
import { useEffect, useState, useCallback } from "react";
import { listActiveAds } from "@/services/ads.service";

interface SimilarItemsProps {
  currentId?: number | string;
  categoryId?: number;
  subcategory?: string;
}

export default function SimilarItems({ currentId, categoryId, subcategory }: SimilarItemsProps) {
  const [items, setItems] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSimilar = useCallback(async () => {
    try {
      setLoading(true);
      let results: any[] = [];
      
      // Step 1: Try subcategory
      if (subcategory) {
        const subRes = await listActiveAds({ subcategory, random: "true", limit: 10 });
        if (subRes.success) {
          results = subRes.data || [];
        }
      }

      // Step 2: Fallback to category if fewer than 4 found
      if (results.length < 4 && categoryId) {
        const catRes = await listActiveAds({ category_id: categoryId, random: "true", limit: 10 });
        if (catRes.success) {
          const catData = catRes.data || [];
          // Merge and avoid duplicates
          const existingIds = new Set(results.map(r => r.id));
          catData.forEach(item => {
            if (!existingIds.has(item.id)) {
              results.push(item);
            }
          });
        }
      }

      // Step 3: Fallback to random if still fewer than 4
      if (results.length < 4) {
        const globalRes = await listActiveAds({ random: "true", limit: 10 });
        if (globalRes.success) {
          const globalData = globalRes.data || [];
          const existingIds = new Set(results.map(r => r.id));
          globalData.forEach(item => {
            if (!existingIds.has(item.id)) {
              results.push(item);
            }
          });
        }
      }

      // Filter out current product and take 4
      const filtered = results
        .filter(d => String(d.id) !== String(currentId))
        .slice(0, 4);

      const mapped: AdItem[] = filtered.map((d: any) => ({
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
    } finally {
      setLoading(false);
    }
  }, [currentId, categoryId, subcategory]);

  useEffect(() => {
    fetchSimilar();
  }, [fetchSimilar]);

  if (loading || items.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 lg:px-0 pb-12 pt-5">
      <h3 className="text-2xl font-extrabold text-[#f45c03] mb-6">Similar Items You May Like</h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <AdCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}

