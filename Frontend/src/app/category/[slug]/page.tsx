import React from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CategoryListingClient from "../../../components/CategoryListingClient";
import { apiFetch } from "@/services/apiClient";
import { ENDPOINTS } from "@/utils/constants";
import { searchDeals } from "@/services/search.service";

type Props = {
  params: { slug: string };
};

export default async function CategoryPage({ params }: Props) {
  const slug = params?.slug ?? "";

  const formatSlug = (s: string) => {
    if (!s) return "";
    return s
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  let categoryId: number | undefined;
  let categoryLabel = formatSlug(slug);

  try {
    const catRes = await apiFetch<{ success: boolean; data: any }>(`${ENDPOINTS.categories}/${slug}`);
    if (catRes.success && catRes.data) {
      categoryId = Number(catRes.data.id);
      categoryLabel = catRes.data.name;
    } else {
      console.warn(`Category not found for slug: ${slug}`);
    }
  } catch (err) {
    console.error("Failed to fetch category by slug:", err);
  }

  // If we couldn't find the category ID, the backend search will return everything.
  // We should only fetch if we have a valid ID to ensure category-specific results.
  let items = [];
  if (categoryId) {
    const res = await searchDeals({ category_id: categoryId, page: 1, limit: 100 });
    items = res.data || [];
  } else {
    // Optionally return empty or tell user category not found
    items = [];
  }

  const brands = [
    "huawei",
    "redmi",
    "samsung",
    "oppo",
    "lg",
    "apple",
    "infinix",
    "tecno",
  ];

  const displayItems = items.map((l: any) => ({
    id: l.id,
    title: l.title,
    price: `₦${Number(l.price).toLocaleString()}`,
    desc: l.description || undefined,
    badge: l.image_url || "/assets/images/bgphone.svg",
    location: l.location || l.city || "Nigeria",
    condition: l.condition || "Brand New",
  }));

  return (
    <>
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-6">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">
            <Link href="/" className="text-gray-600 hover:underline">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="font-medium">{categoryLabel}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-orange-600">All Listings</h1>

          <div className="text-sm text-gray-600 mt-1">{displayItems.length} items found</div>
        </div>

        {/* Brand Strip */}
        <div className="w-full bg-white border border-orange-200 rounded-md p-3 mb-6 shadow-sm">
          <div className="flex items-center gap-8 py-2 px-2 justify-start flex-nowrap overflow-x-auto">
            {brands.map((b) => {
              const label = b.charAt(0).toUpperCase() + b.slice(1);
              return (
                <div
                  key={b}
                  className="flex flex-col items-center flex-none w-[80px] sm:w-[96px] md:w-[110px] p-1"
                >
                  <div className="w-full h-10 sm:h-12 md:h-14 flex items-center justify-center bg-white rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/assets/images/brand/${b}.svg`}
                      alt={b}
                      className="max-h-7 sm:max-h-9 md:max-h-11 object-contain"
                    />
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-700 mt-1 text-center">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CategoryListingClient
          items={displayItems}
          title={categoryLabel}
          brands={brands}
        />
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
}