"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, Package, ExternalLink, Check, X, Timer } from "lucide-react";
import { getDealsAdmin, approveDealAdmin, rejectDealAdmin, setPendingDealAdmin } from "@/lib/api";
import { useAlert } from "@/context/AlertContext";
import Link from "next/link";

export default function CSRDealManagement() {
  const { showAlert, showPrompt } = useAlert();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchDeals = async (p = page, s = search, status = statusFilter) => {
    setLoading(true);
    try {
      // Reusing admin API since CSR has 'staff' permissions
      const res = await getDealsAdmin(p, 10, s);
      if (res.success) {
        let filteredData = res.data;
        if (status !== 'all') {
            filteredData = filteredData.filter((d: any) => d.status === status);
        }
        setDeals(filteredData);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error("Failed to fetch deals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDeals(1, search, statusFilter);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchDeals(newPage, search, statusFilter);
  };

  const handleStatusAction = async (id: number, type: 'approve' | 'pending' | 'reject') => {
    let reason = "";
    if (type === 'reject') {
        reason = await showPrompt("Reason for rejection?", "", "Rejection Reason") || "";
        if (!reason) return;
    }

    setActionLoading(id);
    try {
      let res;
      if (type === 'approve') res = await approveDealAdmin(id);
      else if (type === 'pending') res = await setPendingDealAdmin(id);
      else res = await rejectDealAdmin(id, reason);

      if (res.success) {
        showAlert(`Product status updated to ${type}`, "Success");
        fetchDeals(page, search, statusFilter);
      }
    } catch (err: any) {
      showAlert(err.message || "Action failed", "Error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
            <Package className="text-orange-500" />
            Deal Moderation
          </h3>
          <p className="text-zinc-500 text-sm">Review activity and manage listing statuses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-300"
            >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
            </select>
            <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-300 outline-none transition-all"
                />
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Merchant</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Moderation Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-orange-600" />
                    <span className="text-zinc-400 font-medium font-black uppercase tracking-widest text-[10px]">Fetching Listings...</span>
                  </div>
                </td>
              </tr>
            ) : deals.length > 0 ? (
              deals.map((deal) => (
                <tr key={deal.id} className="group hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {deal.images && deal.images[0] ? (
                                <img src={deal.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Package className="text-zinc-300" size={20} />
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-zinc-900 text-sm truncate max-w-[200px]">{deal.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-zinc-400 text-[10px] font-bold">ID: #{deal.id}</span>
                                <Link 
                                    href={`/product/${deal.id}`}
                                    target="_blank"
                                    className="text-orange-600 hover:text-orange-700 text-[10px] font-black uppercase flex items-center gap-1"
                                >
                                    Visit <ExternalLink size={10} />
                                </Link>
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-sm text-zinc-600 font-bold">{deal.merchant || "Standard Merchant"}</div>
                     <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Vendor Account</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                      deal.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      deal.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {deal.status !== 'active' && (
                        <button
                          onClick={() => handleStatusAction(deal.id, 'approve')}
                          disabled={actionLoading === deal.id}
                          className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"
                          title="Approve Listing"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {deal.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusAction(deal.id, 'pending')}
                          disabled={actionLoading === deal.id}
                          className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm border border-amber-100"
                          title="Set to Pending"
                        >
                          <Timer size={16} />
                        </button>
                      )}
                      {deal.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusAction(deal.id, 'reject')}
                          disabled={actionLoading === deal.id}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm border red-100"
                          title="Reject Listing"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <Package size={40} className="mx-auto text-zinc-200 mb-2" />
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No matching listings found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <p className="text-xs text-zinc-400 font-black uppercase tracking-widest">
            Page <span className="text-orange-600">{page}</span> of {meta.pages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= meta.pages}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
