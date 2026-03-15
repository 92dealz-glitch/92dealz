"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, Download } from "lucide-react";
import { API_BASE } from "@/services/apiClient";

type VendorStatus = "Paid" | "Unpaid";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Paid" | "Unpaid">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetch(`${API_BASE}/users?role=vendor`);
        const data = await res.json();
        if (data.success) {
          // Map backend users to vendor display format
          const mapped = data.data.map((u: any) => ({
            id: u.id,
            business: u.name || "Unknown Business",
            type: "General", // Default as not in schema
            location: "Nigeria", // Default
            marketer: "Admin", // Default
            status: "Paid" as VendorStatus, // Default
            email: u.email
          }));
          setVendors(mapped);
        }
      } catch (err) {
        console.error("Failed to load vendors", err);
      } finally {
        setLoading(false);
      }
    }
    loadVendors();
  }, []);

  const filteredVendors = vendors.filter(v => {
    const matchesFilter = filter === "All" || v.status === filter;
    const matchesSearch = v.business.toLowerCase().includes(search.toLowerCase()) || 
                          v.marketer.toLowerCase().includes(search.toLowerCase()) ||
                          v.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading vendors...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Vendors Management</h1>
          <p className="text-zinc-500 font-medium">Manage and monitor all onboarded vendors</p>
        </div>
        <button className="flex items-center gap-3 bg-[#F05023] hover:bg-[#D44D1F] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-orange-100">
          <Plus size={20} />
          Add Vendor
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-zinc-100">
          <div className="flex p-1 bg-[#F9FAFB] rounded-xl w-fit border border-zinc-200">
            {(["All", "Paid", "Unpaid"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  filter === t 
                    ? "bg-white text-zinc-900 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search business or marketer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-zinc-200 rounded-xl outline-none focus:border-[#F05023] transition-colors text-sm font-medium"
              />
            </div>
            <button className="p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <Download size={20} className="text-zinc-600" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-zinc-200">
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Business Name</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Marketer</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="group hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-6">
                    <span className="text-zinc-900 font-bold text-[15px]">{vendor.business}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-zinc-600 font-medium text-sm bg-zinc-100 px-3 py-1.5 rounded-lg">{vendor.type}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-zinc-500 font-medium text-sm">{vendor.location}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-zinc-900 font-bold text-sm">{vendor.marketer}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      vendor.status === 'Paid' 
                        ? 'bg-[#D1FAE5] text-[#059669]' 
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="text-[#F05023] font-bold text-sm hover:underline underline-offset-4 decoration-2">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-zinc-400 font-black">No vendors found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
