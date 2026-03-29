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

  try {
    const catRes = await apiFetch<{ success: boolean; data: any }>(`${ENDPOINTS.categories}/${slug}`);
    if (catRes.success && catRes.data) {
      categoryId = catRes.data.id;
      categoryLabel = catRes.data.name;
    }
  } catch (err) {
    console.error(`[CategoryPage] Failed to fetch category for slug "${slug}":`, err);
  }

  // If subcategory is present, we might want to append it to the label
  const displayTitle = sub ? `${categoryLabel} - ${sub}` : categoryLabel;

  const res = await searchDeals({ 
    category_id: categoryId, 
    subcategory: sub, 
    page: 1, 
    limit: 50 
  });
  
  let items = res.data || [];
  let isFallback = false;

  const displayItems = items.map((l: any) => ({
    id: l.id,
    title: l.title,
    price: `₦${Number(l.price).toLocaleString()}`,
    priceRaw: Number(l.price),
    desc: l.description || undefined,
    badge: l.image_url || "/assets/images/bgphone.svg",
    location: l.location || l.city || "Nigeria",
    condition: l.condition || "Brand New",
  }));

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