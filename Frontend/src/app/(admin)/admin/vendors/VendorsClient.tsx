"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2, Store, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { getAdminVendors, updateAdminVendorStatus, deleteAdminVendor } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import { useAlert } from "@/context/AlertContext";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: "pending" | "active" | "rejected";
  businessName: string | null;
  createdAt: string;
  subscription_plan?: string;
  basic_plan_expires_at?: string;
  star_plan_expires_at?: string;
}

export default function VendorsManagement() {
  const { showNotification } = useNotification();
  const { showConfirm } = useAlert();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await getAdminVendors();
      if (res.success && res.data) {
        setVendors(res.data);
      }
    } catch (err) {
      showNotification("error", "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleUpdateStatus = async (id: number, status: "active" | "rejected") => {
    try {
      await updateAdminVendorStatus(id, status);
      showNotification("success", `Vendor marked as ${status}`);
      fetchVendors();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to update vendor status");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!await showConfirm(`Are you absolutely sure you want to permanently delete the vendor "${name}" and all of their deals/products? This action cannot be undone.`, "Confirm Permanent Deletion")) {
      return;
    }
    
    try {
      await deleteAdminVendor(id);
      showNotification("success", "Vendor and associated deals deleted successfully");
      fetchVendors();
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete vendor");
    }
  };

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      (v.businessName && v.businessName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Vendors Management</h1>
          <p className="text-zinc-500">Approve, reject, or suspend vendor accounts</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-3">
        <Search className="text-zinc-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or business name..."
          className="flex-1 outline-none text-sm bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Store size={48} className="mx-auto text-zinc-300 mb-4" />
            <p className="font-medium text-lg text-zinc-900">No vendors found</p>
            <p>No vendor applications match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/50">
                  <th className="p-4 font-semibold text-zinc-600">Business/Owner</th>
                  <th className="p-4 font-semibold text-zinc-600">Contact</th>
                  <th className="p-4 font-semibold text-zinc-600">Registered</th>
                  <th className="p-4 font-semibold text-zinc-600">Plans</th>
                  <th className="p-4 font-semibold text-zinc-600">Status</th>
                  <th className="p-4 font-semibold text-zinc-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {vendor.businessName ? vendor.businessName[0].toUpperCase() : vendor.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900">{vendor.businessName || "No Business Name"}</div>
                          <div className="text-zinc-500 hidden sm:block">{vendor.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-zinc-900">{vendor.email}</div>
                      <div className="text-zinc-500 text-xs mt-0.5">{vendor.phone || "No phone"}</div>
                    </td>
                    <td className="p-4 text-zinc-600">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {(!vendor.basic_plan_expires_at && !vendor.star_plan_expires_at) && (
                          <span className="text-[10px] font-black text-zinc-400 uppercase">None</span>
                        )}
                        {vendor.basic_plan_expires_at && (
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-black uppercase">Featured</span>
                            <span className="text-[10px] text-zinc-400 font-bold">{new Date(vendor.basic_plan_expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        {vendor.star_plan_expires_at && (
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase">Premium</span>
                            <span className="text-[10px] text-zinc-400 font-bold">{new Date(vendor.star_plan_expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {vendor.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {vendor.status === "active" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle size={12} /> Active
                        </span>
                      )}
                      {vendor.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      {vendor.status === "pending" || vendor.status === "rejected" ? (
                        <button
                          onClick={() => handleUpdateStatus(vendor.id, "active")}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-medium rounded-lg text-xs hover:bg-emerald-100 transition border border-emerald-200"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(vendor.id, "rejected")}
                          className="px-3 py-1.5 bg-red-50 text-red-600 font-medium rounded-lg text-xs hover:bg-red-100 transition border border-red-200"
                        >
                          Suspend
                        </button>
                      )}
                      
                      {vendor.status === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(vendor.id, "rejected")}
                          className="px-3 py-1.5 bg-red-50 text-red-600 font-medium rounded-lg text-xs hover:bg-red-100 transition border border-red-200"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(vendor.id, vendor.name)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200"
                        title="Delete Vendor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
