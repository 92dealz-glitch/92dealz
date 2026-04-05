"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Loader2, X, Trash2, ShieldOff, CheckCircle, Headphones, Eye, EyeOff, Clock, Activity, Edit3 } from "lucide-react";
import { useAlert } from "@/context/AlertContext";

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  note: string;
  total_time_spent: number;
  last_seen: string;
  createdAt: string;
}

export default function StaffManagement() {
  const { showAlert, showConfirm } = useAlert();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [noteModal, setNoteModal] = useState<{ show: boolean, id: number | null, note: string }>({
    show: false, id: null, note: ""
  });

  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/staff`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) setStaffList(data.data);
    } catch (err: any) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/staff`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to create staff");

      setFormSuccess("Staff created successfully!");
      setFormData({ name: "", email: "", password: "", phone: "" });
      fetchStaff();
      setTimeout(() => setShowModal(false), 2000);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/staff/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showAlert(err.message, "Status Update Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleNoteUpdate = async () => {
    if (!noteModal.id) return;
    setActionLoading(noteModal.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/staff/${noteModal.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ note: noteModal.note }),
      });
      const data = await res.json();
      if (data.success) {
        setStaffList(prev => prev.map(s => s.id === noteModal.id ? { ...s, note: noteModal.note } : s));
        setNoteModal({ show: false, id: null, note: "" });
        showAlert("Note updated successfully", "Success");
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showAlert(err.message, "Update Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!await showConfirm("Are you sure? This will delete the staff member PERMANENTLY.", "Confirm Deletion")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/staff/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setStaffList(prev => prev.filter(s => s.id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showAlert(err.message, "Deletion Error");
    } finally {
      setActionLoading(null);
    }
  };

  const formatOnlineStatus = (lastSeen: string | null) => {
    if (!lastSeen) return <span className="text-zinc-400">Offline</span>;
    const diff = Date.now() - new Date(lastSeen).getTime();
    if (diff < 3 * 60 * 1000) return <span className="text-emerald-500 font-bold flex items-center gap-1"><Activity className="w-3 h-3" /> Online</span>;
    return <span className="text-zinc-500">Offline</span>;
  };

  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return "0 hrs";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs} hr ${mins} min`;
    return `${mins} min`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2 font-black uppercase tracking-tight">
            <Headphones className="text-orange-500" />
            Customer Service Staff
          </h3>
          <p className="text-zinc-500 text-sm font-medium italic">Manage CSR logins, track time, and monitor status</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all shadow-md active:scale-95"
        >
          <UserPlus size={18} />
          Add CSR Staff
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-600" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-100">
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200">Staff Member</th>
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200">Admin Notes</th>
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200 text-center">Status / Time</th>
                <th className="px-4 py-3 font-black text-black border-b-2 border-zinc-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {staffList.map((s) => (
                <tr key={s.id} className="group hover:bg-orange-50/20 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-zinc-900 text-sm">{s.name}</div>
                    <div className="text-zinc-500 text-xs">{s.email}</div>
                  </td>
                  <td className="px-4 py-4 w-1/3">
                    <div className="text-zinc-600 text-xs italic bg-zinc-50 p-2 rounded-lg border border-zinc-100 group-hover:bg-white transition-colors relative pr-8">
                       {s.note || "No administrative notes."}
                       <button onClick={() => setNoteModal({ show: true, id: s.id, note: s.note || "" })} className="absolute right-2 top-2 text-zinc-400 hover:text-orange-500">
                          <Edit3 size={14} />
                       </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1 text-[10px] uppercase font-black tracking-widest">
                        {formatOnlineStatus(s.last_seen)}
                        <span className="flex items-center gap-1 text-zinc-500 mt-1 bg-zinc-100 px-2 py-0.5 rounded">
                           <Clock size={10} /> {formatTimeSpent(s.total_time_spent)}
                        </span>
                        {s.status === 'suspended' && (
                           <span className="text-red-500 mt-1 px-2 py-0.5 rounded bg-red-50 border border-red-100">Suspended</span>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {s.status === 'suspended' ? (
                        <button
                          onClick={async () => { if (await showConfirm("Restore this CSR account?", "Activate Staff")) handleStatusUpdate(s.id, 'active'); }}
                          disabled={actionLoading === s.id}
                          className="p-2 rounded-lg transition-all bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                          title="Activate Account"
                        >
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={async () => { if (await showConfirm("Suspend this CSR account?", "Suspend Staff")) handleStatusUpdate(s.id, 'suspended'); }}
                          disabled={actionLoading === s.id}
                          className="p-2 rounded-lg transition-all bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                          title="Suspend Account"
                        >
                          <ShieldOff size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={actionLoading === s.id}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                 <tr>
                    <td colSpan={4} className="text-center py-8 text-zinc-500 text-sm font-medium">No customer service staff found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE STAFF MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
               <h3 className="font-bold text-zinc-900 uppercase text-sm tracking-widest">Add CSR Staff</h3>
               <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
               {formError && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase">{formError}</div>}
               {formSuccess && <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase">{formSuccess}</div>}
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
                 <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition font-bold" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">System Email ID</label>
                 <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300 outline-none transition font-bold" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Portal Password</label>
                 <div className="relative">
                   <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition pr-11 font-bold" />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                 </div>
               </div>
               <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 uppercase text-xs tracking-widest">
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Staff Account"}
               </button>
             </form>
           </div>
        </div>
      )}

      {/* NOTE MODAL */}
      {noteModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-orange-50 border-b border-orange-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"><Edit3 size={18} /></div>
              <h3 className="font-black uppercase tracking-tight text-orange-900">Admin Note</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <textarea 
                  placeholder="Write administrative notes about this CSR here..." 
                  value={noteModal.note} 
                  onChange={(e) => setNoteModal({ ...noteModal, note: e.target.value })} 
                  rows={5} 
                  className="w-full border border-zinc-200 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 resize-none transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setNoteModal({ show: false, id: null, note: "" })} className="flex-1 py-3.5 border border-zinc-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-colors">Cancel</button>
                <button disabled={actionLoading !== null} onClick={handleNoteUpdate} className="flex-[1.5] py-3.5 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 shadow-lg shadow-orange-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {actionLoading !== null ? <Loader2 className="animate-spin" size={16} /> : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
