"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdCard, { AdItem } from "./ui/AdCard";

export default function SearchResultsClient({ items, query }: { items: AdItem[]; query: string }) {
  const sp = useSearchParams();
  const effectiveQuery = (query || sp.get("search") || sp.get("q") || "").toString();
  const [mode, setMode] = useState<"exact" | "contains">("contains");
  const filtered = useMemo(() => {
    const q = (effectiveQuery || "").toLowerCase().trim();
    if (!q) return items;
    if (mode === "exact") return items.filter((x) => (x.title || "").toLowerCase().trim() === q);
    return items.filter((x) => (x.title || "").toLowerCase().includes(q));
  }, [items, effectiveQuery, mode]);
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {`Showing ${filtered.length} result(s) ${effectiveQuery ? `for "${effectiveQuery}"` : ""}`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("exact")}
            className={`px-3 py-1 rounded text-sm font-bold ${mode === "exact" ? "bg-orange-500 text-white" : "border border-zinc-300 text-zinc-700"}`}
          >
            Exact
          </button>
          <button
            onClick={() => setMode("contains")}
            className={`px-3 py-1 rounded text-sm font-bold ${mode === "contains" ? "bg-orange-500 text-white" : "border border-zinc-300 text-zinc-700"}`}
          >
            Contains
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-gray-600">No listings found.</div>
      ) : (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-12 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[1fr] items-stretch">
            {filtered.map((it) => (
              <AdCard key={it.id} item={it} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
