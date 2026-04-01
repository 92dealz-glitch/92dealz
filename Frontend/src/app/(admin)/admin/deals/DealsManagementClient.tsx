"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Plus, 
  ChevronDown, 
  MoreHorizontal,
  Download,
  Bell,
  Edit2,
  Trash2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";
import { apiFetch } from "@/services/apiClient";

const statusStyles = {
  active: "bg-[#10B981] text-white",
  published: "bg-[#10B981] text-white",
  draft: "bg-[#0EA5E9] text-white",
  scheduled: "bg-[#F59E0B]/80 text-white",
  expired: "bg-[#4B5563] text-white",
  sold: "bg-zinc-700 text-white",
  closed: "bg-zinc-400 text-white",
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString();
}

export default function DealsManagementPage() {
  const { showNotification } = useNotification();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    async function loadDeals() {
      try {
        const result = await apiFetch<{ success: boolean; data: any[] }>("admin/deals", {}, true);
        if (result.success) {
          setDeals(result.data);
        }
      } catch (err) {
        console.error("Failed to load deals", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchSearch = (deal.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All Status" || (deal.status || "").toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [deals, searchTerm, statusFilter]);

  const handleDelete = async (id: number) => {
    try {
      const result = await apiFetch<{ success: boolean }>(`admin/deals/${id}`, { method: "DELETE" }, true);
      if (result.success) {
        setDeals(prev => prev.filter(d => d.id !== id));
        showNotification("warning", "Deal removed successfully.");
      }
    } catch (err) {
      showNotification("error", "Failed to delete deal.");
    }
    setActiveMenuId(null);
  };

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading deals...</div>;

  return (
    <div className="space-y-8 font-bold">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-zinc-900 font-bold">Deals Management</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Manage all deals and promotions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#f45c03] text-[#f45c03] rounded-lg bg-white hover:bg-orange-50 transition-colors text-sm font-bold shadow-sm active:scale-95">
            <Download size={16} />
            Export
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg text-zinc-900 font-bold">All Deals</h2>
              <p className="text-sm text-zinc-500 font-medium">Manage and monitor all deals on the platform</p>
            </div>

            {/* Filters and Actions Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-3xl">
                {/* Search */}
                <div className="relative flex-1 w-full font-bold">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors text-zinc-700 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Dropdown */}
                <div className="relative w-full sm:w-48">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 text-zinc-700 font-bold cursor-pointer"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Scheduled</option>
                    <option>Expired</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Add New Deal Button */}
              <Link 
                href="/admin/deals/new"
                className="flex items-center justify-center gap-2 bg-[#f45c03] text-white px-6 py-2.5 rounded-lg hover:bg-[#f45c03] transition-colors font-bold shadow-md shadow-[#f45c03]/20 active:scale-95"
              >
                <Plus size={20} />
                Add New Deal
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-[11px] font-black uppercase tracking-widest border-b border-zinc-100">
                <th className="px-6 py-5">Deal Title</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Merchant</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Clicks</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">Last Updated</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 italic">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-6 max-w-[240px]">
                    <span className="text-[15px] font-black text-zinc-900 leading-tight block">{deal.title}</span>
                  </td>
                  <td className="px-6 py-6 font-black">
                    <span className="text-[15px] text-zinc-900">₦{Number(deal.price).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[14px] text-zinc-500 font-bold">{deal.merchant || "Unknown"}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[14px] text-zinc-400 font-medium whitespace-nowrap">{deal.category || "General"}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusStyles[deal.status as keyof typeof statusStyles] || "bg-gray-400 text-white"}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-[14px] text-zinc-600 font-bold">{deal.clicks?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-6 py-6 text-right whitespace-nowrap">
                    <span className="text-[14px] text-zinc-400 font-medium">{formatTimeAgo(deal.updatedAt)}</span>
                  </td>
                  <td className="px-6 py-6 text-center relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === deal.id ? null : deal.id)}
                      className="p-2 text-zinc-300 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-all active:scale-95"
                    >
                      <MoreHorizontal size={22} />
                    </button>
                    
                    {/* Floating Action Menu */}
                    {activeMenuId === deal.id && (
                      <div className="absolute right-14 top-4 z-50 w-52 bg-white border border-zinc-200 rounded-2xl shadow-2xl py-3 animate-in zoom-in-95 duration-200 font-bold text-sm not-italic">
                        <Link 
                          href={`/admin/deals/edit/${deal.id}`}
                          className="flex items-center gap-3 px-5 py-2.5 text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                          <Edit2 size={18} className="text-orange-500" />
                          Edit Deal
                        </Link>
                        <Link 
                          href={`/product/${deal.id}`}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                          <ExternalLink size={18} className="text-blue-500" />
                          View Page
                        </Link>
                        <div className="h-px bg-zinc-100 my-2 mx-3" />
                        <button 
                          onClick={() => handleDelete(deal.id)}
                          className="w-full flex items-center gap-3 px-5 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                          Delete Deal
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-32 text-center text-zinc-400 font-bold italic text-lg">
                    No deals found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Click outside backdrop for menu */}
      {activeMenuId && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setActiveMenuId(null)} />
      )}
    </div>
  );
}

