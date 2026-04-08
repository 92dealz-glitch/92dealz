import React from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CategoryListingClient from "../../../components/CategoryListingClient";
import { apiFetch } from "@/services/apiClient";
import { ENDPOINTS } from "@/utils/constants";
import { listActiveAds } from "@/services/ads.service";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const sub = typeof resolvedSearchParams?.sub === "string" ? resolvedSearchParams.sub : undefined;

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

    // Resolve Deals - use both ID and Name for redundancy if possible
    if (categoryId || sub || categoryLabel) {
      const res = await listActiveAds({ 
        category_id: categoryId,
        category_name: categoryLabel, // Send both as safety net
        limit: 50,
        page: 1
      });
      items = res.data || [];
    }
  } catch (err) {
    console.error(`[CategoryPage] Critical Fetch Error for "${slug}":`, err);
    items = [];
  }

  const displayItems = items.map((l: any) => {
    const priceStr = l.price !== undefined && l.price !== null ? Number(l.price).toLocaleString() : "0";
    return {
      id: l.id,
      title: l.title || "Untitled Deal",
      price: `₦${priceStr}`,
      priceValue: Number(l.price || 0),
      desc: l.description || "",
      badge: l.image_url || "/assets/images/bgphone.svg",
      location: l.location || "Nigeria",
      state: l.state,
      city: l.city,
      condition: l.condition || "New",
      views: l.clicks || 0,
      rating: l.rating || 0,
      isVerified: l.is_verified || l.User?.is_verified || false,
    };
  });

  // Diagnostics for production logs (visible as small text at bottom)
  const diagnostics = `Slug: ${slug} | ID: ${categoryId || 'None'} | Count: ${displayItems.length}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1200px] mx-auto w-full px-4 sm:px-6 mt-8 pb-16">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 mb-4 bg-white/50 w-fit px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-semibold text-gray-900">{categoryLabel || slug || "Category"}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Explore <span className="text-orange-600">{categoryLabel || slug}</span>
              </h1>
              <p className="text-gray-500 mt-2 font-medium">
                Browse our curated collection of {displayItems.length} items in {categoryLabel || slug}
              </p>
            </div>
          </div>
        </div>

        {displayItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No matching results found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
              Try adjusting your filters or browsing other categories to find the best deals.
            </p>
            <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100">
              Return Home
            </Link>
            <div className="mt-12 pt-8 border-t border-gray-50 opacity-20 text-[10px] font-mono">
              Diagnostic Data: {diagnostics}
            </div>
          </div>
        ) : (
          <CategoryListingClient
            items={displayItems}
            title={categoryLabel || slug}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}