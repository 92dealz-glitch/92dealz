"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Loader2, X, Trash2, ShieldAlert, CheckCircle, ShieldOff, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { getVendorsAdmin, updateVendorStatusAdmin, deleteVendorAdmin } from "@/lib/api";
import { useAlert } from "@/context/AlertContext";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  businessName: string;
  createdAt: string;
  businessAddress?: string;
  government_id_url?: string;
  is_verified?: boolean;
  about?: string;
  suspension_reason?: string;
}

export default function VendorManagement() {
  const { showAlert, showConfirm } = useAlert();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Suspension Modal State
  const [suspensionModal, setSuspensionModal] = useState<{ show: boolean, id: number | null }>({
    show: false,
    id: null
  });
  const [suspensionReason, setSuspensionReason] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await getVendorsAdmin();
      if (res.success) {
        setVendors(res.data);
      }
    } catch (err: any) {
      setError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/vendors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to create vendor");
  
        setSuccess("Vendor created successfully!");
        setFormData({ name: "", email: "", password: "", phone: "" });
        fetchVendors();
        setTimeout(() => setShowModal(false), 2000);
      } catch (err: any) {
        setError(err.message);
      }
  };

  const handleStatusUpdate = async (id: number, newStatus: string, reason?: string) => {
    setActionLoading(id);
    try {
      const res = await updateVendorStatusAdmin(id, newStatus, reason);
      if (res.success) {
        setVendors(prev => prev.map(v => v.id === id ? { ...v, status: newStatus as any, suspension_reason: reason } : v));
        setSuspensionModal({ show: false, id: null });
        setSuspensionReason("");
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      showAlert(err.message, "Status Update Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm("Are you sure? This will delete the vendor AND all their deals PERMANENTLY.", "Confirm Deletion")) return;

    setActionLoading(id);
    try {
      const res = await deleteVendorAdmin(id);
      if (res.success) {
        setVendors(prev => prev.filter(v => v.id !== id));
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      showAlert(err.message, "Deletion Error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2 font-black uppercase tracking-tight">
            <User className="text-orange-500" />
            Vendor Management
          </h3>
          <p className="text-zinc-500 text-sm font-medium italic">Manage existing vendors and their account status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#f45c03] text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-md active:scale-95"
        >
          <UserPlus size={18} />
          Add New Vendor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-orange-600" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-100">
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200">Vendor</th>
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200">Business</th>
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200 text-center">Status</th>
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {vendors.map((v) => (
                <tr key={v.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-zinc-900 text-sm">{v.name}</div>
                    <div className="text-zinc-500 text-xs">{v.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-zinc-700 text-sm">{v.businessName || "Personal Account"}</div>
                    <div className="text-zinc-500 text-xs">{v.phone || "No phone"}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        v.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                        v.status === 'suspended' ? 'bg-red-100 text-red-600 shadow-sm shadow-red-50' :
                        'bg-amber-100 text-amber-600'
                    }`}>
                        {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedVendor(v)}
                        className="p-2 rounded-lg transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {v.status === 'suspended' ? (
                        <button
                          onClick={async () => {
                            if (await showConfirm("Restore this account?", "Activate Vendor")) {
                              handleStatusUpdate(v.id, 'active');
                            }
                          }}
                          disabled={actionLoading === v.id}
                          className="p-2 rounded-lg transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          title="Activate Account"
                        >
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSuspensionModal({ show: true, id: v.id })}
                          disabled={actionLoading === v.id}
                          className="p-2 rounded-lg transition-all bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                          title="Suspend Account"
                        >
                          <ShieldOff size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={actionLoading === v.id}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE VENDOR MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <h3 className="font-bold text-zinc-900 uppercase text-sm tracking-widest">Create New Vendor</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase">
                  {success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vendor's full name"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set account password"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition pr-11 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Phone (Optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f45c03] text-white font-black py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 uppercase text-xs tracking-widest"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Vendor Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUSPENSION REASON MODAL */}
      {suspensionModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <ShieldOff size={18} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-red-900">Suspend Vendor Account</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Reason for Suspension</label>
                <textarea 
                  placeholder="e.g., Suspicious activity, Violation of Terms, Reported for fraud..."
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  rows={4}
                  className="w-full border border-zinc-200 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-200 resize-none transition-all"
                />
                <p className="mt-2 text-[10px] text-zinc-400 font-medium italic">This message will be sent directly to the vendor.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setSuspensionModal({ show: false, id: null })}
                  className="flex-1 py-3.5 border border-zinc-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!suspensionReason.trim() || actionLoading !== null}
                  onClick={() => suspensionModal.id && handleStatusUpdate(suspensionModal.id, 'suspended', suspensionReason)}
                  className="flex-[1.5] py-3.5 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-100 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {actionLoading !== null ? <Loader2 className="animate-spin" size={16} /> : "Suspend Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR DETAIL MODAL */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 sticky top-0 z-10">
              <h3 className="font-black uppercase tracking-tight text-zinc-900">Vendor Profile</h3>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Profile Overview */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl rotate-3">
                  <User size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-zinc-900">{selectedVendor.name}</h4>
                  <p className="text-zinc-500 font-medium text-sm">{selectedVendor.email}</p>
                  <div className={`mt-2 inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    selectedVendor.status === 'active' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                  }`}>
                    {selectedVendor.status}
                  </div>
                </div>
              </div>

              {/* Status & Warning Notice */}
              {selectedVendor.status === 'suspended' && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4">
                  <AlertCircle className="text-red-600 shrink-0" size={24} />
                  <div>
                    <h5 className="text-red-900 font-bold text-sm uppercase tracking-tight mb-1">Suspension Record</h5>
                    <p className="text-red-700 text-sm italic font-medium leading-relaxed bg-white/50 p-3 rounded-lg border border-red-50">
                      "{selectedVendor.suspension_reason || "No specific reason provided."}"
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Phone Number</p>
                  <p className="font-bold text-zinc-900">{selectedVendor.phone || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Joined On</p>
                  <p className="font-bold text-zinc-900">{new Date(selectedVendor.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-8">
                <h4 className="text-xs font-black text-zinc-900 mb-4 uppercase tracking-widest border-l-4 border-orange-500 pl-3">Business Information</h4>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Business Name</p>
                        <p className="font-bold text-zinc-900">{selectedVendor.businessName || "Personal Account"}</p>
                     </div>
                  </div>
                  {selectedVendor.businessAddress && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Physical Address</p>
                      <p className="font-medium text-zinc-900 text-sm leading-relaxed">{selectedVendor.businessAddress}</p>
                    </div>
                  )}
                  {selectedVendor.about && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Commercial Bio</p>
                      <p className="font-medium text-zinc-500 text-sm leading-relaxed italic">{selectedVendor.about}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-8">
                <h4 className="text-xs font-black text-zinc-900 mb-4 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Trust & Safety</h4>
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedVendor.is_verified ? (
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                        <CheckCircle size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
                        <ShieldAlert size={20} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                        {selectedVendor.is_verified ? "Platform Verified" : "Verification Pending"}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Commercial Authenticity</p>
                    </div>
                  </div>
                </div>

                {selectedVendor.government_id_url && (
                  <div className="mt-6 flex items-center justify-between p-4 bg-zinc-900 text-white rounded-2xl shadow-xl hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <Eye size={16} />
                         </div>
                         <span className="font-black uppercase text-[10px] tracking-widest">Government ID Document</span>
                    </div>
                    <a
                      href={selectedVendor.government_id_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase underline hover:text-orange-400"
                    >
                      View
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
