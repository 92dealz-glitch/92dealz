import React, { useEffect, useState } from "react";
import type { CategoryData } from "../data/categoriesData";
import { getCategory } from "../data/categoriesData";

type Props = {
  category: string;
  className?: string;
  onSelect?: (item: string) => void;
};

export default function CategoryMegaMenu({ category, className, onSelect }: Props) {
  const [info, setInfo] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getCategory(category);
      if (!mounted) return;
      setInfo(data ?? null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [category]);

  if (loading) {
    return (
      <div
        className={
          "absolute left-0 top-full mt-0 w-full bg-white/92 backdrop-blur-sm border-t border-zinc-200 shadow-[0_18px_40px_rgba(15,23,42,0.08)] py-8 " +
          (className || "")
        }
        style={{ zIndex: 60 }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-zinc-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div
      className={
        "absolute left-0 top-full mt-0 w-full bg-white/92 backdrop-blur-sm border-t border-zinc-200 shadow-[0_18px_40px_rgba(15,23,42,0.08)] py-8 " +
        (className || "")
      }
      style={{ zIndex: 60 }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-5 gap-12">
          {info.columns.map((col, i) => (
            <div key={i} className="text-left">
              <div className="text-sm font-extrabold text-zinc-900 mb-4 uppercase tracking-wider">{col.heading}</div>
              <ul className="space-y-4 text-base text-zinc-700">
                {col.items.map((it) => (
                  <li key={it}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(it)}
                      className="text-left w-full hover:text-orange-600 leading-7"
                    >
                      {it}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
