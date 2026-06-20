"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, Package, ExternalLink, Check, X, Timer, Eye, AlertCircle, ShoppingBag, MapPin, Tag, Info } from "lucide-react";
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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchDeals = async (p = page, s = search, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await getDealsAdmin(p, 10, s);
      if (res.success) {
        let filteredData = res.data.map((d: any) => {
            let images = [d.image_url || '/assets/images/bgphone.svg'];
            if (d.images_json) {
                try {
                    const parsed = typeof d.images_json === 'string' ? JSON.parse(d.images_json) : d.images_json;
                    if (Array.isArray(parsed) && parsed.length > 0) images = parsed;
                } catch (e) { console.error("Failed to parse images_json", e); }
            }
            return { ...d, images };
        });
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
        if (selectedProduct && selectedProduct.id === id) {
            setSelectedProduct({ ...selectedProduct, status: type, rejection_reason: type === 'reject' ? reason : null });
        }
        fetchDeals(page, search, statusFilter);
      }
    } catch (err: any) {
      showAlert(err.message || "Action failed", "Error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
              <Package className="text-[#708238]" />
              Deal Moderation
            </h3>
            <p className="text-zinc-500 text-sm">Review activity and manage listing statuses</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
              <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#E9E0D4]/30"
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
                      className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#E9E0D4]/30 outline-none transition-all"
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
                <th className="px-6 py-4 text-center">Plan</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-[#708238]" />
                      <span className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">Fetching Listings...</span>
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
                                  <span className="text-zinc-400 text-[10px] font-bold tracking-tight">ID: #{deal.id}</span>
                                  <Link 
                                      href={`/product/${deal.id}`}
                                      target="_blank"
                                      className="text-[#708238] hover:text-[#5E6E2F] text-[10px] font-black uppercase flex items-center gap-1"
                                  >
                                      External <ExternalLink size={10} />
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
                       <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                          deal.plan_type === 'star' ? 'bg-yellow-100 text-yellow-700' : 
                          deal.plan_type === 'basic' ? 'bg-[#E9E0D4] text-[#5E6E2F]' : 
                          'bg-zinc-100 text-zinc-500'
                        }`}>
                          {deal.plan_type === 'star' ? 'Premium' : deal.plan_type === 'basic' ? 'Featured' : 'Standard'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                          deal.status === 'active' ? 'bg-[#FFFDF9]/30 text-emerald-600 border-emerald-100' :
                          deal.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {deal.status}
                        </span>
                        {deal.status === 'rejected' && deal.rejection_reason && (
                           <span className="text-[10px] text-red-400 font-medium italic truncate max-w-[120px]" title={deal.rejection_reason}>
                               {deal.rejection_reason}
                           </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => setSelectedProduct(deal)}
                            className="p-2 bg-zinc-100 text-zinc-600 hover:bg-[#708238] hover:text-white rounded-xl transition-all border border-zinc-200"
                            title="Quick View"
                        >
                            <Eye size={16} />
                        </button>
                        <div className="h-6 w-[1px] bg-zinc-200 mx-1"></div>
                        {deal.status !== 'active' && (
                          <button
                            onClick={() => handleStatusAction(deal.id, 'approve')}
                            disabled={actionLoading === deal.id}
                            className="p-2 bg-[#FFFDF9]/30 text-emerald-600 hover:bg-[#F8F4EE]merald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {deal.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusAction(deal.id, 'reject')}
                            disabled={actionLoading === deal.id}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm border border-red-100"
                            title="Reject"
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

        {meta && meta.pages > 1 && (
          <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <p className="text-xs text-zinc-400 font-black uppercase tracking-widest">
              Page <span className="text-[#708238]">{page}</span> of {meta.pages}
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

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
              <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
                  {/* Left: Images */}
                  <div className="md:w-1/2 bg-zinc-50 p-6 flex flex-col gap-4">
                      <div className="relative flex-1 rounded-2xl overflow-hidden border border-zinc-200 bg-white">
                        <img 
                            src={selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0] : "/assets/images/bgphone.svg"} 
                            alt="" 
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-200 flex items-center gap-1.5 shadow-sm">
                            <Tag size={12} className="text-[#708238]" />
                            <span className="text-xs font-black uppercase tracking-tight">₦{Number(selectedProduct.price).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedProduct.images?.map((img: string, i: number) => (
                            <div key={i} className="w-16 h-16 rounded-lg border border-zinc-200 overflow-hidden flex-shrink-0 bg-white">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                      </div>
                  </div>

                  {/* Right: Info */}
                  <div className="md:w-1/2 p-8 flex flex-col h-full overflow-y-auto">
                      <button 
                        onClick={() => setSelectedProduct(null)}
                        className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
                      >
                          <X size={20} />
                      </button>

                      <div className="mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#708238] mb-2 block">Quick Inspection</span>
                        <h2 className="text-2xl font-black text-zinc-900 leading-tight mb-2">{selectedProduct.title}</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-zinc-300" /> {selectedProduct.location || "Lagos, Pakistan"}</span>
                            <span className="flex items-center gap-1.5"><ShoppingBag size={14} className="text-zinc-300" /> {selectedProduct.merchant}</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Description</h4>
                            <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedProduct.description || "No detailed description provided."}</p>
                        </div>

                        {selectedProduct.status === 'rejected' && selectedProduct.rejection_reason && (
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 border-dashed">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle size={14} className="text-red-500" />
                                    <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">Previous Rejection Reason</span>
                                </div>
                                <p className="text-red-700 text-sm font-bold italic">"{selectedProduct.rejection_reason}"</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Status</span>
                                <span className={`text-sm font-black uppercase ${
                                    selectedProduct.status === 'active' ? 'text-emerald-600' :
                                    selectedProduct.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                    {selectedProduct.status}
                                </span>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block">Category</span>
                                <span className="text-sm font-black uppercase text-zinc-700">{selectedProduct.category || "General"}</span>
                            </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between gap-4">
                        <Link 
                            href={`/product/${selectedProduct.id}`}
                            target="_blank"
                            className="text-xs font-black uppercase text-zinc-400 hover:text-[#708238] flex items-center gap-2 transition-colors"
                        >
                            View Full Page <ExternalLink size={14} />
                        </Link>
                        <div className="flex items-center gap-3">
                            {selectedProduct.status !== 'active' && (
                                <button
                                    onClick={() => handleStatusAction(selectedProduct.id, 'approve')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="px-6 py-2.5 bg-[#F8F4EE]merald-600 text-white rounded-xl text-xs font-bold hover:bg-[#F8F4EE]merald-700 transition-all shadow-lg shadow-[#E9E0D4]/30 flex items-center gap-2"
                                >
                                    <Check size={16} /> Approve Ad
                                </button>
                            )}
                            {selectedProduct.status !== 'rejected' && (
                                <button
                                    onClick={() => handleStatusAction(selectedProduct.id, 'reject')}
                                    disabled={actionLoading === selectedProduct.id}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
                                >
                                    <X size={16} /> Reject Ad
                                </button>
                            )}
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}


