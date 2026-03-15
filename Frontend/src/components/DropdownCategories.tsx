import Image from "next/image";
import { ChevronRight } from "lucide-react";
import React from "react";

type Category = {
  id: string;
  title: string;
  icon: string;
  count?: string;
};

const categories: Category[] = [
  { id: "fashion", title: "Fashion", icon: "/assets/images/dress.svg", count: "137,118 ads" },
  { id: "phones", title: "Phones & tablets", icon: "/assets/images/phone.svg", count: "137,118 ads" },
  { id: "computer", title: "Computer & accessories", icon: "/assets/images/laptop.svg", count: "137,118 ads" },
  { id: "vehicle", title: "Vehicle", icon: "/assets/images/car.svg", count: "137,118 ads" },
  { id: "properties", title: "Properties", icon: "/assets/images/house.svg", count: "137,118 ads" },
  { id: "health", title: "Health & beauty", icon: "/assets/images/woman.svg", count: "137,118 ads" },
  { id: "furniture", title: "Furniture & appliances", icon: "/assets/images/furniture.svg", count: "137,118 ads" },
  { id: "babies", title: "Babies & kids", icon: "/assets/images/girl.svg", count: "137,118 ads" },
  { id: "agriculture", title: "Agriculture & food", icon: "/assets/images/foodbaasket.svg", count: "137,118 ads" },
  { id: "services", title: "Services", icon: "/assets/images/engineer.svg", count: "137,118 ads" },
  { id: "electronics", title: "Electronics", icon: "/assets/images/tv.svg", count: "137,118 ads" },
  { id: "commercial", title: "Commercial equipment", icon: "/assets/images/equipment.svg", count: "137,118 ads" },
  { id: "repair", title: "Repair and construction", icon: "/assets/images/equipmentbaket.svg", count: "137,118 ads" },
  { id: "pets", title: "Pets and animals", icon: "/assets/images/pet.svg", count: "137,118 ads" },
];

export default function DropdownCategories({ className, onSelect }: { className?: string; onSelect?: (id: string) => void }) {
  return (
    <div
      className={
        "absolute left-4 top-full mt-2 w-[423px] h-[783px] rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden overflow-y-auto " +
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
              <div className="text-xs text-zinc-500">{c.count}</div>
            </div>

            <div className="text-orange-500">
              <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
