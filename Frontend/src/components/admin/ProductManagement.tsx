"use client";

import React, { useEffect, useState } from "react";
import { Search, Trash2, Loader2, ChevronLeft, ChevronRight, Package, AlertCircle, Pencil } from "lucide-react";
import { getDealsAdmin, deleteDealAdmin, approveDealAdmin, rejectDealAdmin, setPendingDealAdmin } from "@/lib/api";
import { useAlert } from "@/context/AlertContext";
import { Check, X, Timer } from "lucide-react";
import Link from "next/link";

export default function ProductManagement() {
  const { showAlert } = useAlert();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean, id: number | null, title: string }>({
    show: false,
    id: null,
    title: ""
  });
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [actionModal, setActionModal] = useState<{ show: boolean, id: number | null, type: 'reject' | null }>({
    show: false,
    id: null,
    type: null
  });
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDeals = async (p = page, s = search) => {
    setLoading(true);
    try {
      const res = await getDealsAdmin(p, 10, s);
      if (res.success) {
        setDeals(res.data);
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
      fetchDeals(1, search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchDeals(newPage, search);
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      const res = await deleteDealAdmin(deleteModal.id, reason);
      if (res.success) {
        setDeleteModal({ show: false, id: null, title: "" });
        setReason("");
        fetchDeals(page, search);
      }
    } catch (err) {
      showAlert("Failed to delete deal", "Delete Error");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusAction = async (id: number, type: 'approve' | 'pending' | 'reject', reason?: string) => {
    setActionLoading(true);
    try {
      let res;
      if (type === 'approve') res = await approveDealAdmin(id);
      else if (type === 'pending') res = await setPendingDealAdmin(id);
      else res = await rejectDealAdmin(id, reason || "Does not meet guidelines");

      if (res.success) {
        setActionModal({ show: false, id: null, type: null });
        setActionReason("");
        fetchDeals(page, search);
      }
    } catch (err: any) {
      showAlert(err.message || "Action failed", "Error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
            <Package className="text-[#708238]" />
            Product Management
          </h3>
          <p className="text-zinc-500 text-sm">Review, search, and manage all platform products</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-[#E9E0D4]/30 outline-none transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4 text-center">Price</th>
              <th className="px-6 py-4">Merchant</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-[#708238]" />
                    <span className="text-zinc-400 font-medium">Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : deals.length > 0 ? (
              deals.map((deal) => (
                <tr key={deal.id} className="group hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900 text-sm">{deal.title}</div>
                    <div className="text-zinc-500 text-[11px] mt-0.5">ID: #{deal.id} • {new Date(deal.updatedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-zinc-700">
                    ₦{deal.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 font-medium">{deal.merchant || "Unknown"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${
                      deal.status === 'active' ? 'bg-[#FFFDF9] text-emerald-600' :
                      deal.status === 'draft' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {deal.status !== 'active' && (
                        <button
                          onClick={() => handleStatusAction(deal.id, 'approve')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF9]/30 text-emerald-600 hover:bg-[#F8F4EE]merald-600 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 border border-emerald-100"
                          title="Approve Listing"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                      )}
                      {deal.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusAction(deal.id, 'pending')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 border border-amber-100"
                          title="Set to Pending"
                        >
                          <Timer size={14} />
                          Pending
                        </button>
                      )}
                      {deal.status !== 'rejected' && (
                        <button
                          onClick={() => setActionModal({ show: true, id: deal.id, type: 'reject' })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E9E0D4] text-[#708238] hover:bg-[#708238] hover:text-white rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 border border-[#E9E0D4]/30"
                          title="Reject Listing"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      )}
                      
                      {/* Full Edit Link */}
                      <Link 
                        href={`/admin/deals/edit/${deal.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Full Details"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => setDeleteModal({ show: true, id: deal.id, title: deal.title })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Package size={40} className="mx-auto text-zinc-200 mb-2" />
                  <p className="text-zinc-400 font-bold">No products found matching your search.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <p className="text-xs text-zinc-500">
            Showing Page <span className="font-bold text-zinc-900">{page}</span> of <span className="font-bold text-zinc-900">{meta.pages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 border border-zinc-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page >= meta.pages}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 border border-zinc-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-red-900">Confirm Removal</h3>
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider">Product: {deleteModal.title}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-zinc-600 text-sm">
                Deleting this product will remove it permanently from the platform. The vendor will be notified of the removal.
              </p>
              
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                  Reason for removal
                </label>
                <textarea
                  placeholder="e.g., Prohibited item, Invalid pricing, Duplicate listing..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-24 rounded-xl border border-zinc-200 p-4 text-sm focus:ring-2 focus:ring-red-300 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { setDeleteModal({ show: false, id: null, title: "" }); setReason(""); }}
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!reason.trim() || deleting}
                  onClick={handleDelete}
                  className="flex-[1.5] px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md shadow-red-200"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {actionModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="p-6 bg-[#E9E0D4] border-b border-[#E9E0D4]/30 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E9E0D4] rounded-full flex items-center justify-center text-[#708238]">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-orange-900">Reject Ad</h3>
                <p className="text-[#708238] text-[10px] font-bold uppercase tracking-wider">Please provide a reason</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <textarea
                placeholder="Reason for rejection..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full h-24 rounded-xl border border-zinc-200 p-4 text-sm outline-none focus:ring-2 focus:ring-[#E9E0D4]/30 transition-all resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setActionModal({ show: false, id: null, type: null })}
                  className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!actionReason.trim() || actionLoading}
                  onClick={() => actionModal.id && handleStatusAction(actionModal.id, 'reject', actionReason)}
                  className="flex-[1.5] px-4 py-3 bg-[#708238] text-white rounded-xl font-bold hover:bg-[#5E6E2F] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
                  Reject Ad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


