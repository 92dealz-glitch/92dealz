"use client";

import React, { useEffect, useState } from "react";
import { useLocationFilter } from "@/context/LocationFilterContext";
import { apiFetch } from "@/services/apiClient";
import { NIGERIAN_STATES, NIGERIAN_LOCATIONS } from "@/data/locationData";
import { ChevronDown, MapPin, Globe } from "lucide-react";

type LocationCounts = {
  locations: { name: string; count: number }[];
  states: { name: string; count: number }[];
  cities: { name: string; state: string; count: number }[];
};

export default function LocationFilterBar() {
  const { filter, setCountry, setState, setCity, resetAll } = useLocationFilter();
  const [counts, setCounts] = useState<LocationCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await apiFetch<{ success: boolean; data: LocationCounts }>("/ads/counts/location");
        if (res.success) setCounts(res.data);
      } catch (err) {
        console.error("Failed to fetch location counts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const getCountryCount = (name: string) => counts?.locations.find(l => (l.name || "").toLowerCase() === name.toLowerCase())?.count || 0;
  const getStateCount = (name: string) => counts?.states.find(s => (s.name || "").toLowerCase() === name.toLowerCase())?.count || 0;
  const getCityCount = (name: string, state: string) => {
      return counts?.cities.find(c => 
          (c.name || "").toLowerCase() === name.toLowerCase() && 
          (c.state || "").toLowerCase() === state.toLowerCase()
      )?.count || 0;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 mt-8 mb-4">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100 p-5 md:p-8">
        <div className="flex flex-col md:flex-row items-end gap-6">
          
          {/* Country Selector */}
          <div className="w-full md:w-[220px]">
            <label className="block text-[11px] font-black text-orange-600 uppercase mb-2 ml-1 flex items-center gap-1.5 tracking-wider">
              <Globe size={14} className="text-orange-500" /> Country
            </label>
            <div className="relative group">
              <select 
                value={filter.country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-14 pl-5 pr-12 rounded-2xl border-2 border-orange-50 bg-orange-50/20 text-[15px] font-bold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm group-hover:border-orange-200"
              >
                <option value="All">All Regions</option>
                <option value="Nigeria">Nigeria ({getCountryCount('Nigeria')})</option>
                <option value="China">China ({getCountryCount('China')})</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none group-hover:text-orange-600 transition-colors" size={20} />
            </div>
          </div>

          {/* State Selector (Nigeria only) */}
          {filter.country === "Nigeria" && (
            <div className="w-full md:w-[260px] animate-in fade-in slide-in-from-left-4 duration-500">
              <label className="block text-[11px] font-black text-orange-600 uppercase mb-2 ml-1 flex items-center gap-1.5 tracking-wider">
                <MapPin size={14} className="text-orange-500" /> State
              </label>
              <div className="relative group">
                <select 
                  value={filter.state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-14 pl-5 pr-12 rounded-2xl border-2 border-orange-50 bg-orange-50/20 text-[15px] font-bold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm group-hover:border-orange-200"
                >
                  <option value="">All States</option>
                  {NIGERIAN_STATES.map(s => (
                    <option key={s} value={s}>{s} ({getStateCount(s)})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none group-hover:text-orange-600 transition-colors" size={20} />
              </div>
            </div>
          )}

          {/* City Selector (Nigeria State selected) */}
          {filter.country === "Nigeria" && filter.state && (
            <div className="w-full md:w-[260px] animate-in fade-in slide-in-from-left-4 duration-500">
              <label className="block text-[11px] font-black text-orange-600 uppercase mb-2 ml-1 flex items-center gap-1.5 tracking-wider">
                <MapPin size={14} className="text-orange-500" /> City
              </label>
              <div className="relative group">
                <select 
                  value={filter.city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-14 pl-5 pr-12 rounded-2xl border-2 border-orange-50 bg-orange-50/20 text-[15px] font-bold text-gray-800 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm group-hover:border-orange-200"
                >
                  <option value="">All Cities</option>
                  {(NIGERIAN_LOCATIONS[filter.state] || []).map(c => (
                    <option key={c} value={c}>{c} ({getCityCount(c, filter.state)})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none group-hover:text-orange-600 transition-colors" size={20} />
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="flex-1 flex justify-end pb-1">
            <button 
              onClick={resetAll}
              className="px-8 py-3.5 text-sm font-black text-orange-600 hover:text-white border-2 border-orange-50 hover:bg-orange-600 hover:border-orange-600 rounded-2xl transition-all active:scale-95 whitespace-nowrap"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
