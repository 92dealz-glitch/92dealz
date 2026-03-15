"use client";
import React, { useMemo, useState } from "react";
import AdCard from "./ui/AdCard";
import LocationDropdown from "./LocationDropdown";
import SelectDropdown from "./ui/SelectDropdown";

import type { AdItem } from "./ui/AdCard";

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill={i < value ? "#f97316" : "none"}
          stroke={i < value ? "#f97316" : "#d1d5db"}
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Chevron Icon ─────────────────────────────────────────────────────────────
function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7.5 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Section Toggle ───────────────────────────────────────────────────────────
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
        <span
          className="font-semibold text-base"
          style={{ color: "#f97316" }}
        >
          {label}
        </span>
        <span
          className="text-xl font-light leading-none"
          style={{ color: "#9ca3af", lineHeight: 1 }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CategoryListingClient({
  items,
  title,
  brands,
}: {
  items: AdItem[];
  title: string;
  brands: string[];
}) {
  type ListingItem = AdItem & { priceRaw?: number; rating?: number; brand?: string };

  const [location, setLocation] = useState<string | undefined>(undefined);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [rating, setRating] = useState<number | undefined>(undefined);

  const [pricePreset, setPricePreset] = useState<string | undefined>(undefined);
  const [customMin, setCustomMin] = useState<string>("");
  const [customMax, setCustomMax] = useState<string>("");

  const [openLocation, setOpenLocation] = useState<boolean>(false);
  const [openPrice, setOpenPrice] = useState<boolean>(true);
  const [openCondition, setOpenCondition] = useState<boolean>(true);
  const [openBrand, setOpenBrand] = useState<boolean>(true);
  const [openRating, setOpenRating] = useState<boolean>(true);

  const [sortBy, setSortBy] = useState<string>("recommended");
  const [page, setPage] = useState<number>(1);
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
        if (location && it.location && !it.location.toLowerCase().includes(location.toLowerCase())) return false;
        if (selectedConditions.length > 0) {
          if (!it.condition) return false;
          if (!selectedConditions.some((c) => it.condition!.toLowerCase().includes(c.toLowerCase()))) return false;
        }
        if (selectedBrands.length > 0) {
          if (!it.brand) return false;
          if (!selectedBrands.some((b) => it.brand!.toLowerCase() === b.toLowerCase())) return false;
        }
        if (rating !== undefined && (!it.rating || it.rating < rating)) return false;
        const price = typeof it.priceRaw === "number" ? it.priceRaw : undefined;
        if (preset.min !== undefined && price !== undefined && price < preset.min) return false;
        if (preset.max !== undefined && price !== undefined && price > preset.max) return false;
        if (customMinNum !== undefined && price !== undefined && price < customMinNum) return false;
        if (customMaxNum !== undefined && price !== undefined && price > customMaxNum) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "lowest") return (a.priceRaw ?? 0) - (b.priceRaw ?? 0);
        if (sortBy === "highest") return (b.priceRaw ?? 0) - (a.priceRaw ?? 0);
        if (sortBy === "newest") return Number(b.id) - Number(a.id);
        return 0;
      });
  }, [items, location, selectedConditions, selectedBrands, rating, pricePreset, customMinNum, customMaxNum, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const clearAll = () => {
    setLocation(undefined);
    setSelectedConditions([]);
    setSelectedBrands([]);
    setBrandSearch("");
    setRating(undefined);
    setPricePreset(undefined);
    setCustomMin("");
    setCustomMax("");
    setPage(1);
  };

  const filteredBrands = brands
    .map((b) => b.charAt(0).toUpperCase() + b.slice(1))
    .filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));

  const priceOptions = [
    { id: "under20000", label: "Under ₦20000" },
    { id: "30000-40000", label: "₦30000 - ₦40000" },
    { id: "40000-50000", label: "₦40000 - ₦50000" },
    { id: "50000-60000", label: "₦50000 - ₦60000" },
    { id: "above100000", label: "Above ₦100000" },
  ];

  const conditionOptions = ["Brand New", "Nigeria Used", "Foreign Used", "Fairly Used"];

  const ratingOptions = [
    { value: 4, stars: [true, true, true, true, false] },
    { value: 3, stars: [true, true, true, false, false] },
    { value: 2, stars: [true, true, false, false, false] },
    { value: 1, stars: [true, false, false, false, false] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* ── Sidebar ── */}
      <aside className="md:col-span-3">
        <div
          className="bg-white rounded-lg overflow-hidden"
          style={{ border: "1.5px solid #fed7aa" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="font-bold text-base text-gray-900">Filters</span>
            <button
              onClick={clearAll}
              className="font-semibold text-sm"
              style={{ color: "#f97316" }}
            >
              Clear All
            </button>
          </div>

          {/* Location */}
          <div className="border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpenLocation((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3.5"
              style={{ minHeight: 52 }}
            >
              <span className="font-semibold text-base" style={{ color: "#f97316" }}>Location</span>
              <ChevronRight className="text-gray-400" />
            </button>
            {openLocation && (
              <div className="px-4 pb-4">
                <LocationDropdown
                  openOnMount={openLocation}
                  value={location ?? "Lagos"}
                  onChange={(l) => { setLocation(l); setPage(1); }}
                />
              </div>
            )}
          </div>

          {/* Price */}
          <FilterSection label="Price" open={openPrice} onToggle={() => setOpenPrice((v) => !v)}>
            <div className="space-y-3">
              {priceOptions.map(({ id, label }) => (
                <label key={id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={pricePreset === id}
                    onChange={() => { setPricePreset(id); setPage(1); }}
                    className="h-4 w-4 cursor-pointer"
                    style={{ accentColor: "#f97316" }}
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            {/* Custom Price Range */}
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2" style={{ color: "#f97316" }}>
                Custom Price Range
              </p>
              <div className="flex items-center gap-2">
                <input
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  className="w-full border rounded text-sm px-3 py-2 outline-none focus:ring-1"
                  style={{ borderColor: "#fed7aa", focusBorderColor: "#f97316" } as React.CSSProperties}
                  placeholder="₦10000"
                />
                <input
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  className="w-full border rounded text-sm px-3 py-2 outline-none"
                  style={{ borderColor: "#fed7aa" }}
                  placeholder="₦10000"
                />
                <button
                  onClick={() => setPage(1)}
                  className="flex-shrink-0 px-4 py-2 rounded text-sm font-semibold text-white"
                  style={{ background: "#f97316" }}
                >
                  GO
                </button>
              </div>
              {(customMin || customMax) && (
                <button
                  onClick={() => { setCustomMin(""); setCustomMax(""); }}
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#f97316" }}
                >
                  Clear
                </button>
              )}
            </div>
          </FilterSection>

          {/* Condition */}
          <FilterSection label="Condition" open={openCondition} onToggle={() => setOpenCondition((v) => !v)}>
            <div className="space-y-3">
              {conditionOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(opt)}
                    onChange={(e) => {
                      setSelectedConditions((s) =>
                        e.target.checked ? [...s, opt] : s.filter((c) => c !== opt)
                      );
                      setPage(1);
                    }}
                    className="h-4 w-4 rounded cursor-pointer"
                    style={{ accentColor: "#f97316" }}
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Brand */}
          <FilterSection label="Brand" open={openBrand} onToggle={() => setOpenBrand((v) => !v)}>
            {/* Search */}
            <div
              className="flex items-center rounded overflow-hidden mb-3"
              style={{ border: "1.5px solid #fed7aa" }}
            >
              <input
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand"
                className="flex-1 text-sm px-3 py-2 outline-none bg-white"
              />
              <button
                className="flex-shrink-0 flex items-center justify-center px-3 py-2"
                style={{ background: "#f97316" }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.2">
                  <circle cx="9" cy="9" r="6" />
                  <path d="M15 15l-3-3" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Brand checkboxes */}
            <div className="space-y-3">
              {filteredBrands.map((label) => {
                const selected = selectedBrands.some((b) => b.toLowerCase() === label.toLowerCase());
                return (
                  <label key={label} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        setSelectedBrands((s) =>
                          e.target.checked
                            ? [...s, label]
                            : s.filter((x) => x.toLowerCase() !== label.toLowerCase())
                        );
                        setPage(1);
                      }}
                      className="h-4 w-4 rounded cursor-pointer"
                      style={{ accentColor: "#f97316" }}
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection label="Rating" open={openRating} onToggle={() => setOpenRating((v) => !v)}>
            <div className="space-y-3">
              {ratingOptions.map(({ value, stars }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === value}
                    onChange={() => { setRating(value); setPage(1); }}
                    className="h-4 w-4 cursor-pointer"
                    style={{ accentColor: "#f97316" }}
                  />
                  <span className="flex items-center gap-0.5">
                    {stars.map((filled, i) => (
                      <svg
                        key={i}
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill={filled ? "#f97316" : "none"}
                        stroke={filled ? "#f97316" : "#d1d5db"}
                        strokeWidth="1.5"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </aside>

      {/* ── Listings ── */}
      <section className="md:col-span-9">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="text-sm text-gray-700">
            Items found: <span className="font-semibold">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-gray-600">Sort By:</span>
            <SelectDropdown
              value={sortBy}
              onChange={(v) => { setSortBy(v || "recommended"); setPage(1); }}
              options={["recommended", "newest", "lowest", "highest"]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.length === 0 ? (
            <div className="p-6 bg-white border rounded-md col-span-full text-gray-500">
              No items match filters.
            </div>
          ) : (
            paged.map((it) => {
              // override badge image for category listing page
              const catKey = (it as any).category ?? title?.toLowerCase();
              const badgeForCategory = (key?: string) => {
                if (!key) return "/assets/images/bgshoe.svg";
                const k = key.toString().toLowerCase();
                if (k.includes("phone")) return "/assets/images/bgphone.svg";
                if (k.includes("fashion") || k.includes("dress") || k.includes("shoe")) return "/assets/images/bgdress.svg";
                if (k.includes("shoe") || k.includes("shoes")) return "/assets/images/bgshoe.svg";
                // fallback
                return "/assets/images/bgshoe.svg";
              };

              const displayItem = { ...(it as any), badge: badgeForCategory(catKey) };

              return (
                <div key={it.id} className="h-full">
                  <AdCard item={displayItem} />
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded text-sm bg-white disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className="px-3 py-1 border rounded text-sm"
              style={
                page === i + 1
                  ? { background: "#f97316", color: "#fff", borderColor: "#f97316" }
                  : { background: "#fff" }
              }
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded text-sm bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}