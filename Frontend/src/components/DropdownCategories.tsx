import Image from "next/image";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getFallbackArray } from "../data/categoriesData";

type CategoryItem = {
  id: string;
  title: string;
  icon: string;
};

export default function DropdownCategories({ className, onSelect }: { className?: string; onSelect?: (id: string) => void }) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    getFallbackArray().then((res) => {
      if (mounted) setCategories(res);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div
      className={
        "absolute left-4 top-full mt-2 w-[423px] max-h-[783px] rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden overflow-y-auto " +
        (className || "")
      }
      style={{ zIndex: 50 }}
    >
      <div className="p-2">
        {categories.map((c) => (
          <button
            key={c.id}
            className="flex items-center w-full gap-3 rounded-md px-2 py-2 hover:bg-zinc-50"
            type="button"
            onClick={() => onSelect?.(c.id)}
          >
            <div className="flex-shrink-0">
              <Image src={c.icon} alt={c.title} width={40} height={40} className="object-contain" />
            </div>

            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-zinc-800">{c.title}</div>
            </div>

            <div className="text-[#708238]">
              <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


