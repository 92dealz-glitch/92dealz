"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PlusCircle, Package } from "lucide-react";
import { getFallbackArray } from "../data/categoriesData";

type CategoryItem = {
  id: string;
  title: string;
  icon: string;
};

export default function CategoryBar() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    getFallbackArray().then((res) => {
      if (mounted) setCategories(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const renderIcon = (c: CategoryItem | { id: string; title: string; icon: string }) => {
    if (brokenImages[c.id] || !c.icon) {
      return <Package size={48} className="text-orange-600" />;
    }
    return (
      <Image
        src={c.icon}
        alt={c.title}
        width={84}
        height={84}
        className="object-contain"
        onError={() => handleImageError(c.id)}
      />
    );
  };

  // Prepend "Post ad" special item
  const postAdItem = { id: "post-ad", title: "Post ad", icon: "" };
  const allItems = [postAdItem, ...categories];

  // Split items into two rows
  const firstRow = allItems.slice(0, 5);
  const secondRow = allItems.slice(5);

  return (
    <div className="lg:hidden px-4 py-4 bg-white">
      {/* Title */}
      <h2 className="text-orange-600 font-bold text-lg mb-3">
        Browse by category
      </h2>

      {/* Rows Container */}
      <div className="flex flex-col gap-4">
        {[firstRow, secondRow].map((row, idx) => (
          <div key={idx} className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-4 snap-x snap-mandatory">
              {row.map((c) => (
                <div key={c.id} className="flex-none w-[100px] snap-center">
                  <div
                    className="w-[90px] h-[90px] mx-auto rounded-2xl p-2 flex items-center justify-center border-2 border-orange-100 bg-orange-50/30 shadow-sm transition-transform hover:scale-95 active:scale-90"
                  >
                    {c.id === "post-ad" ? (
                      <PlusCircle size={48} className="text-orange-600" />
                    ) : (
                      renderIcon(c)
                    )}
                  </div>
                  <div className="mt-2 text-center text-[11px] font-bold text-zinc-700 leading-tight">
                    {c.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
