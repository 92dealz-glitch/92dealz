"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Store, Camera, Smartphone, Laptop, Car, Home as HomeIcon, Footprints, Briefcase, Dog, Utensils, Construction, Tv, HeartPulse, Palette, Package, PlusCircle, Trophy } from "lucide-react";

const categories = [
  { name: "Post ad", src: "", icon: PlusCircle },
  { name: "Electronics", src: "/assets/images/laptop.svg", icon: Laptop },
  { name: "Mobiles", src: "/assets/images/phone.svg", icon: Smartphone },
  { name: "Vehicles", src: "/assets/images/car.svg", icon: Car },
  { name: "Property", src: "/assets/images/house.svg", icon: HomeIcon },
  { name: "Fashion", src: "/assets/images/bgshoe.svg", icon: Footprints },
  { name: "Business", src: "/assets/images/engineer.svg", icon: Briefcase },
  { name: "Sports", src: "", icon: Trophy },
  { name: "Pets", src: "/assets/images/pet.svg", icon: Dog },
];

export default function CategoryBar() {
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    setBrokenImages((prev) => ({ ...prev, [name]: true }));
  };

  const renderIcon = (c: (typeof categories)[0]) => {
    if (brokenImages[c.name]) {
      const Icon = c.icon;
      return <Icon size={48} className="text-orange-600" />;
    }
    return (
      <Image
        src={c.src}
        alt={c.name}
        width={84}
        height={84}
        className="object-contain"
        onError={() => handleImageError(c.name)}
      />
    );
  };

  // Split categories into two rows
  const firstRow = categories.slice(0, 5);
  const secondRow = categories.slice(5);

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
                <div key={c.name} className="flex-none w-[100px] snap-center">
                  <div
                    className="w-[90px] h-[90px] mx-auto rounded-2xl p-2 flex items-center justify-center border-2 border-orange-100 bg-orange-50/30 shadow-sm transition-transform hover:scale-95 active:scale-90"
                  >
                    {renderIcon(c)}
                  </div>
                  <div className="mt-2 text-center text-[11px] font-bold text-zinc-700 leading-tight">
                    {c.name}
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
