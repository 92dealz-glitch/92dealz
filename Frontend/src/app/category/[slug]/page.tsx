import React from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CategoryListingClient from "../../../components/CategoryListingClient";
import { getCategory } from "../../../data/categoriesData";
import { getItemsByCategory, getAllItems } from "../../../data/mockItems";

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

  const category = (await getCategory(slug)) || { title: formatSlug(slug) };
  const items = await getItemsByCategory(slug);

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

  const displayItems = items.length > 0 ? items : (await getAllItems()).slice(0, 6);

  const categoryLabel = (category && category.title) || formatSlug(slug);

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
          title={category.title}
          brands={brands}
        />
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
}