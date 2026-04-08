"use client";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdCard from "./ui/AdCard";
import LocationDropdown from "./LocationDropdown";
import SelectDropdown from "./ui/SelectDropdown";
import { NIGERIAN_LOCATIONS } from "@/data/locationData";
import { ChevronRight } from "lucide-react";

import type { AdItem } from "./ui/AdCard";

function FilterSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5"
        style={{ minHeight: 52 }}
      >
        <span className="font-semibold text-base" style={{ color: "#f45c03" }}>
          {label}
        </span>
        <span className="text-xl font-light leading-none" style={{ color: "#9ca3af" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function SearchResultsClient({ items, query }: { items: AdItem[]; query: string }) {
  const sp = useSearchParams();
  const effectiveQuery = (query || sp.get("search") || sp.get("q") || "").toString();

  type ListingItem = AdItem & { priceRaw?: number };

  const [location, setLocation] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [condition, setCondition] = useState<string | undefined>(undefined);
  const [pricePreset, setPricePreset] = useState<string | undefined>(undefined);
  const [customMin, setCustomMin] = useState<string>("");
  const [customMax, setCustomMax] = useState<string>("");

  const [openLocation, setOpenLocation] = useState<boolean>(true);
  const [openPrice, setOpenPrice] = useState<boolean>(true);
  const [openCondition, setOpenCondition] = useState<boolean>(true);

  const [sortBy, setSortBy] = useState<string>("recommended");
  const [page, setPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const pageSize = 9;

  const customMinNum = customMin !== "" ? Number(customMin) : undefined;
  const customMaxNum = customMax !== "" ? Number(customMax) : undefined;

  const filtered = useMemo(() => {
    const minMaxFromPreset = (preset?: string) => {
      if (!preset) return { min: undefined as number | undefined, max: undefined as number | undefined };
      switch (preset) {
        case "under20000": return { min: undefined, max: 20000 };
        case "30000-40000": return { min: 30000, max: 40000 };
        case "40000-50000": return { min: 40000, max: 50000 };
        case "50000-60000": return { min: 50000, max: 60000 };
        case "above100000": return { min: 100000, max: undefined };
        default: return { min: undefined, max: undefined };
      }
    };

    const preset = minMaxFromPreset(pricePreset);

    return (items as ListingItem[])
      .filter((it) => {
        // Text Search (Title/Desc)
        const q = (effectiveQuery || "").toLowerCase().trim();
        if (q && !(it.title || "").toLowerCase().includes(q) && !(it.desc || "").toLowerCase().includes(q)) return false;

        // Location (State) Filter
        if (location && location !== "All") {
          const itemLoc = (it.location || "").toLowerCase();
          if (!itemLoc.includes(location.toLowerCase())) return false;
        }

        // City Filter
        if (city && city !== "All") {
          const itemCity = (it as any).city?.toLowerCase() || "";
          if (!itemCity.includes(city.toLowerCase())) return false;
        }

        // Condition Filter
        if (condition && condition !== "All") {
          const itemCond = (it.condition || "").toLowerCase();
          if (!itemCond.includes(condition.toLowerCase())) return false;
        }

        // Price Filter
        const price = typeof it.priceRaw === "number" ? it.priceRaw : parseInt(it.price.replace(/[^\d]/g, ""));
        if (price !== undefined) {
          if (preset.min !== undefined && price < preset.min) return false;
          if (preset.max !== undefined && price > preset.max) return false;
          if (customMinNum !== undefined && price < customMinNum) return false;
          if (customMaxNum !== undefined && price > customMaxNum) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        if (a.isVerified !== b.isVerified) return b.isVerified ? -1 : 1;
        if (sortBy === "lowest price") {
            const pA = typeof (a as any).priceRaw === "number" ? (a as any).priceRaw : parseInt(a.price.replace(/[^\d]/g, ""));
            const pB = typeof (b as any).priceRaw === "number" ? (b as any).priceRaw : parseInt(b.price.replace(/[^\d]/g, ""));
            return (pA || 0) - (pB || 0);
        }
        if (sortBy === "highest price") {
            const pA = typeof (a as any).priceRaw === "number" ? (a as any).priceRaw : parseInt(a.price.replace(/[^\d]/g, ""));
            const pB = typeof (b as any).priceRaw === "number" ? (b as any).priceRaw : parseInt(b.price.replace(/[^\d]/g, ""));
            return (pB || 0) - (pA || 0);
        }
        if (sortBy === "newest") return Number(b.id) - Number(a.id);
        return 0;
      });
  }, [items, effectiveQuery, location, city, condition, pricePreset, customMinNum, customMaxNum, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const clearAll = () => {
    setLocation(undefined);
    setCity(undefined);
    setCondition(undefined);
    setPricePreset(undefined);
    setCustomMin("");
    setCustomMax("");
    setPage(1);
  };

  const priceOptions = [
    { id: "under20000", label: "Under ₦20,000" },
    { id: "30000-40000", label: "₦30,000 - ₦40,000" },
    { id: "40000-50000", label: "₦40,000 - ₦50,000" },
    { id: "50000-60000", label: "₦50,000 - ₦60,000" },
    { id: "above100000", label: "Above ₦100,000" },
  ];

  const conditionOptions = ["All", "New", "Used"];

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* ── Mobile Filter Toggle ── */}
        <div className="md:hidden flex items-center justify-between mb-2">
            <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-200 rounded-xl font-bold text-orange-600 shadow-sm active:scale-95 transition-all w-full justify-center"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 3H2l8 9v7l4 3v-10L22 3z" />
                </svg>
                <span>Show Filters</span>
            </button>
        </div>

        {/* ── Sidebar (Collapsible on Mobile) ── */}
        <aside className={`md:col-span-3 ${isMobileFilterOpen ? 'fixed inset-0 z-[60] bg-white p-6 overflow-y-auto block' : 'hidden md:block'}`}>
          {isMobileFilterOpen && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">Filters</h2>
                <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 bg-zinc-100 rounded-full text-gray-500 hover:bg-zinc-200 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
          )}
          
          <div
            className={`bg-white rounded-2xl overflow-hidden shadow-sm ${!isMobileFilterOpen ? 'sticky top-24' : ''}`}
            style={{ border: isMobileFilterOpen ? 'none' : "1.5px solid #fed7aa" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-orange-50/50">
              <span className="font-bold text-lg text-gray-900">Filters</span>
              <button
                onClick={clearAll}
                className="font-bold text-sm hover:underline transition-all"
                style={{ color: "#f45c03" }}
              >
                Clear All
              </button>
            </div>

            {/* Location */}
            <div className="border-t border-orange-100">
              <button
                type="button"
                onClick={() => setOpenLocation((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4"
                style={{ minHeight: 52 }}
              >
                <span className="font-bold text-base text-gray-800">Location</span>
                <ChevronRight className={`text-gray-400 transition-transform duration-200 w-5 h-5 ${openLocation ? 'rotate-90' : ''}`} />
              </button>
              {openLocation && (
                <div className="px-5 pb-5 space-y-4">
                  <LocationDropdown
                    openOnMount={false}
                    value={location ?? "Select State"}
                    onChange={(l) => { setLocation(l); setCity(undefined); setPage(1); }}
                  />
                  
                  {location && location !== "All" && location !== "🇨🇳 CHINA" && NIGERIAN_LOCATIONS[location] && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-black text-orange-600 uppercase mb-2 ml-1">Select City</p>
                      <SelectDropdown
                          value={city || "All Cities"}
                          onChange={(v) => { setCity(v); setPage(1); }}
                          options={["All Cities", ...NIGERIAN_LOCATIONS[location]]}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price */}
            <FilterSection label="Price Range" open={openPrice} onToggle={() => setOpenPrice((v) => !v)}>
              <div className="space-y-3.5">
                {priceOptions.map(({ id, label }) => (
                  <label key={id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={pricePreset === id}
                      onChange={() => { setPricePreset(id); setPage(1); }}
                      className="h-4.5 w-4.5 cursor-pointer accent-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors uppercase">{label}</span>
                  </label>
                ))}
              </div>

              {/* Custom Price Range */}
              <div className="mt-6 pt-6 border-t border-orange-100">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3">
                  Custom Budget
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                     <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₦</span>
                     <input
                      value={customMin}
                      onChange={(e) => setCustomMin(e.target.value.replace(/\D/g, ""))}
                      className="w-full border-2 rounded-lg text-sm pl-5 pr-2 py-2 outline-none focus:border-orange-500 transition-colors"
                      style={{ borderColor: "#fed7aa" }}
                      placeholder="Min"
                    />
                  </div>
                  <div className="relative flex-1">
                     <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₦</span>
                     <input
                      value={customMax}
                      onChange={(e) => setCustomMax(e.target.value.replace(/\D/g, ""))}
                      className="w-full border-2 rounded-lg text-sm pl-5 pr-2 py-2 outline-none focus:border-orange-500 transition-colors"
                      style={{ borderColor: "#fed7aa" }}
                      placeholder="Max"
                    />
                  </div>
                  <button
                    onClick={() => setPage(1)}
                    className="flex-shrink-0 p-2.5 rounded-lg text-white shadow-md hover:shadow-orange-200 transition-all active:scale-95"
                    style={{ background: "#f45c03" }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </FilterSection>

            {/* Condition */}
            <FilterSection label="Condition" open={openCondition} onToggle={() => setOpenCondition((v) => !v)}>
              <div className="space-y-3.5">
                {conditionOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      checked={(condition || "All") === opt}
                      onChange={() => { setCondition(opt === "All" ? undefined : opt); setPage(1); }}
                      className="h-4.5 w-4.5 cursor-pointer accent-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors uppercase">{opt}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {isMobileFilterOpen && (
                <div className="p-5 mt-4">
                    <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="w-full py-4 bg-[#f45c03] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all text-lg"
                    >
                        Apply Filters
                    </button>
                </div>
            )}
          </div>
        </aside>

        {/* ── Listings ── */}
        <section className="md:col-span-9">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 px-1">
            <div className="text-base text-gray-900 font-medium">
              Showing <span className="font-bold text-orange-600">{filtered.length}</span> results {effectiveQuery && <>for <span className="italic">"{effectiveQuery}"</span></>}
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-bold text-gray-500 whitespace-nowrap">SORT BY:</span>
              <div className="min-w-[160px]">
                <SelectDropdown
                  value={sortBy}
                  onChange={(v) => { setSortBy(v || "recommended"); setPage(1); }}
                  options={["recommended", "newest", "lowest price", "highest price"]}
                />
              </div>
            </div>
          </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paged.length === 0 ? (
              <div className="p-12 bg-white border-2 border-dashed border-orange-100 rounded-3xl col-span-full text-center">
                <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f45c03" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">No matching results</h4>
                <p className="text-gray-500 text-sm max-w-[280px] mx-auto">Try adjusting your filters or search criteria to find what you're looking for.</p>
                <button 
                  onClick={clearAll}
                  className="mt-6 text-sm font-bold text-orange-600 hover:text-orange-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              paged.map((it) => (
                <div key={it.id} className="h-full transform transition-transform hover:-translate-y-1">
                  <AdCard item={it} />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-10 h-10 flex items-center justify-center border-2 rounded-xl text-sm bg-white disabled:opacity-30 border-orange-100 hover:border-orange-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                      page === i + 1
                        ? "bg-orange-600 border-orange-600 text-white shadow-orange-200"
                        : "bg-white border-orange-100 text-gray-600 hover:border-orange-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-10 h-10 flex items-center justify-center border-2 rounded-xl text-sm bg-white disabled:opacity-30 border-orange-100 hover:border-orange-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
