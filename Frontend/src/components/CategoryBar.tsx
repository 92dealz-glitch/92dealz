"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { PlusCircle, Package } from "lucide-react";
import Link from "next/link";
import { getFallbackArray } from "../data/categoriesData";

type CategoryItem = {
  id: string;
  title: string;
  icon: string;
};

export default function CategoryBar() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    getFallbackArray().then((res) => {
      if (mounted) setCategories(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isInteracting || categories.length === 0) return;

    let animationFrameId: number;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      // First row: scroll right
      if (scrollRef1.current) {
        scrollRef1.current.scrollLeft += speed;
        if (scrollRef1.current.scrollLeft >= scrollRef1.current.scrollWidth / 2) {
          scrollRef1.current.scrollLeft = 0;
        }
      }
      
      // Second row: scroll left
      if (scrollRef2.current) {
        scrollRef2.current.scrollLeft -= speed;
        if (scrollRef2.current.scrollLeft <= 0) {
          scrollRef2.current.scrollLeft = scrollRef2.current.scrollWidth / 2;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting, categories]);

  const stopInteraction = () => {
    setIsInteracting(true);
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
  };

  const resumeInteraction = () => {
    // Small delay to ensure smooth transition
    interactionTimeout.current = setTimeout(() => {
      setIsInteracting(false);
    }, 500);
  };

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
        fill
        className="object-contain p-2"
        onError={() => handleImageError(c.id)}
      />
    );
  };

  // Prepend "Post ad" special item
  const postAdItem = { id: "post-ad", title: "Post ad", icon: "" };
  const allItems = [postAdItem, ...categories];

  // Split items into two rows and duplicate for infinite scroll
  const firstRowRaw = allItems.slice(0, Math.ceil(allItems.length / 2));
  const secondRowRaw = allItems.slice(Math.ceil(allItems.length / 2));
  
  const firstRow = [...firstRowRaw, ...firstRowRaw];
  const secondRow = [...secondRowRaw, ...secondRowRaw];

  return (
    <div className="lg:hidden px-4 py-4 bg-white overflow-hidden">
      {/* Title */}
      <h2 className="text-orange-600 font-bold text-lg mb-3">
        Browse by category
      </h2>

      {/* Rows Container */}
      <div className="flex flex-col gap-4">
        {[
          { items: firstRow, ref: scrollRef1, label: 'fwd' },
          { items: secondRow, ref: scrollRef2, label: 'bwd' }
        ].map((row, idx) => (
          <div 
            key={idx} 
            ref={row.ref}
            className="overflow-x-auto pb-2 scrollbar-hide"
            onTouchStart={stopInteraction}
            onTouchEnd={resumeInteraction}
            onMouseDown={stopInteraction}
            onMouseUp={resumeInteraction}
            onMouseLeave={resumeInteraction}
          >
            <div className="flex gap-4 w-max">
              {row.items.map((c, i) => (
                <Link 
                  key={`${c.id}-${idx}-${i}`} 
                   href={c.id === "post-ad" ? "/vendor-dashboard/add-product" : `/category/${c.id}`}
                  className="flex-none w-[100px]"
                >
                  <div
                    className="relative w-[90px] h-[90px] mx-auto rounded-md flex items-center justify-center border-2 border-orange-100 bg-orange-50/30 shadow-sm transition-transform hover:scale-95 active:scale-90 overflow-hidden"
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
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
