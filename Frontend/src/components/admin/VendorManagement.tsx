"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Loader2, X, Trash2, ShieldAlert, CheckCircle, ShieldOff, User, Eye, EyeOff } from "lucide-react";
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
}

export default function VendorManagement() {
  const { showAlert, showConfirm } = useAlert();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showModal, setShowModal] = useState(false);
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

  const fetchVendors = async () => {
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
    // Use the existing logic or the new API function
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

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    if (!await showConfirm(`Are you sure you want to ${newStatus === 'suspended' ? 'SUSPEND' : 'ACTIVATE'} this vendor?`, "Confirm Status Change")) return;

    setActionLoading(id);
    try {
      const res = await updateVendorStatusAdmin(id, newStatus);
      if (res.success) {
        setVendors(prev => prev.map(v => v.id === id ? { ...v, status: newStatus as any } : v));
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
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
            <User className="text-orange-500" />
            Vendor Management
          </h3>
          <p className="text-zinc-500 text-sm">Manage existing vendors and their account status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#E85A28] text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm"
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
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200">Vendor</th>
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200">Business</th>
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200 text-center">Status</th>
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200 text-right">Actions</th>
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
                        v.status === 'suspended' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                    }`}>
                        {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusUpdate(v.id, v.status)}
                        disabled={actionLoading === v.id}
                        className={`p-2 rounded-lg transition-colors ${
                          v.status === 'suspended' 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                        title={v.status === 'suspended' ? "Activate" : "Suspend"}
                      >
                        {v.status === 'suspended' ? <CheckCircle size={18} /> : <ShieldOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={actionLoading === v.id}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <h3 className="font-bold text-zinc-900">Create New Vendor</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vendor's full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set account password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E85A28] text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Vendor Account"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
