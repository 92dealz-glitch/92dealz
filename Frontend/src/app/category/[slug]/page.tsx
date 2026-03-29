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
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const slug = params?.slug ?? "";
  const sub = typeof searchParams?.sub === "string" ? searchParams.sub : undefined;

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
  let items: any[] = [];

  try {
    // If slug is numeric, it might be the direct category number
    const isNumericSlug = /^\d+$/.test(slug);
    if (isNumericSlug) {
      categoryId = Number(slug);
    }

    // Resolve Category Metadata
    try {
      const catRes = await apiFetch<{ success: boolean; data: any }>(`${ENDPOINTS.categories}/${slug}`);
      if (catRes.success && catRes.data) {
        // Safe mapping for id, category_id, or even nested data
        const rawId = catRes.data.id ?? catRes.data.category_id;
        if (rawId) categoryId = Number(rawId);
        categoryLabel = catRes.data.name || categoryLabel;
      }
    } catch (catErr) {
      console.error(`[CategoryPage] Metadata fetch failed for "${slug}":`, catErr);
    }

    // Resolve Deals - use categoryId if found, otherwise search by name as fallback
    if (categoryId || sub || categoryLabel) {
      const res = await searchDeals({ 
        category_id: categoryId,
        category_name: !categoryId ? categoryLabel : undefined,
        subcategory: sub, 
        page: 1, 
        limit: 50 
      });
      items = res.data || [];
    }
  } catch (err) {
    console.error(`[CategoryPage] Critical Fetch Error for "${slug}":`, err);
    items = [];
  }

  const displayTitle = sub ? `${categoryLabel} - ${sub}` : categoryLabel;
  let isFallback = false;

  const displayItems = items.map((l: any) => {
    const priceStr = l.price !== undefined && l.price !== null ? Number(l.price).toLocaleString() : "0";
    return {
      id: l.id,
      title: l.title || "Untitled Deal",
      price: `₦${priceStr}`,
      priceRaw: Number(l.price || 0),
      desc: l.description || "",
      badge: l.image_url || "/assets/images/bgphone.svg",
      location: l.location || l.city || l.state || "Nigeria",
      condition: l.condition || "Brand New",
      views: l.clicks || 0,
      rating: l.rating || 0,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 sm:px-6 mt-8 pb-16">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 mb-4 bg-white/50 w-fit px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-gray-900">{isFallback ? "Exclusive Deals" : categoryLabel}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {isFallback ? (
                  <>
                    <span className="text-orange-600">Trending</span> deals for you
                  </>
                ) : (
                  <>
                    Explore <span className="text-orange-600">{categoryLabel}</span>
                  </>
                )}
              </h1>
              <p className="text-gray-500 mt-2 font-medium">
                {isFallback 
                  ? `We couldn't find items in "${displayTitle}", but check these out:` 
                  : `Browse our curated collection of ${displayItems.length} items in ${categoryLabel}`}
              </p>
            </div>
          </div>
        </div>

        <CategoryListingClient
          items={displayItems}
          title={categoryLabel}
        />
      </main>

      <Footer />
    </div>
  );
}