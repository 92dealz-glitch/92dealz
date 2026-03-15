import React from "react";
import Image from "next/image";

const categories = [
  { name: "Post ad", src: "/assets/images/post-ad.png" },
  { name: "Fashion", src: "/assets/images/dress.svg" },
  { name: "Phones & tablets", src: "/assets/images/bgphone.svg" },
  { name: "Computers & acc.", src: "/assets/images/laptop.svg" },
  { name: "Furniture & appliances", src: "/assets/images/furniture.svg" },
  { name: "Babies & kids", src: "/assets/images/girl.svg" },
  { name: "Agriculture & food", src: "/assets/images/foodbaasket.svg" },
  { name: "Sports", src: "/assets/images/sports.svg" },
];

export default function CategoryBar() {
  // Split categories into two rows
  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4);

  return (
    <div className="lg:hidden px-4 py-4 bg-white">
      {/* Title */}
      <h2 className="text-orange-600 font-bold text-lg mb-3">
        Browse by category
      </h2>

      {/* First row */}
      <div className="overflow-x-auto mb-3">
        <div className="flex gap-4 snap-x snap-mandatory">
          {firstRow.map((c) => (
            <div key={c.name} className="flex-none w-[110px] snap-center">
              <div
                className="w-[100px] h-[100px] mx-auto rounded-lg p-2 flex items-center justify-center border-4 shadow-md"
                style={{ borderColor: "#e95a24" }}
              >
                <Image
                  src={c.src}
                  alt={c.name}
                  width={84}
                  height={84}
                  className="object-contain"
                />
              </div>
              <div className="mt-2 text-center text-[13px] font-semibold text-black leading-[1.15]">
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second row */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 snap-x snap-mandatory">
          {secondRow.map((c) => (
            <div key={c.name} className="flex-none w-[110px] snap-center">
              <div
                className="w-[100px] h-[100px] mx-auto rounded-lg p-2 flex items-center justify-center border-4 shadow-md"
                style={{ borderColor: "#e95a24" }}
              >
                <Image
                  src={c.src}
                  alt={c.name}
                  width={84}
                  height={84}
                  className="object-contain"
                />
              </div>
              <div className="mt-2 text-center text-[13px] font-semibold text-black leading-[1.15]">
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
