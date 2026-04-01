"use client";

import React, { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { changePassword } from "@/lib/api";

export default function ChangePasswordForm() {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.current || !formData.new || !formData.confirm) {
      showNotification("error", "All fields are required.");
      return;
    }
    if (formData.new.length < 8) {
      showNotification("error", "Password must be at least 8 characters.");
      return;
    }
    if (formData.new !== formData.confirm) {
      showNotification("error", "Confirm password must match.");
      return;
    }
    
    setIsLoading(true);
    try {
      await changePassword({ 
        currentPassword: formData.current, 
        newPassword: formData.new 
      });
      showNotification("success", "Password changed successfully.");
      setFormData({ current: "", new: "", confirm: "" });
      setIsChanging(false);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isChanging) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
            <Lock size={20} className="text-[#E85A28]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-900">Password</span>
            <span className="text-sm text-zinc-500 font-medium">Last changed 30 days ago</span>
          </div>
        </div>
        <button 
          onClick={() => setIsChanging(true)}
          className="px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 shadow-sm"
        >
          Change Password
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-50 border border-orange-500/20 rounded-2xl animate-in fade-in duration-300 font-bold">
      <h4 className="text-sm text-zinc-900 mb-6">Change Password</h4>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm md:col-span-2">
            <label className="text-zinc-600">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:border-orange-500 text-zinc-700 transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <label className="text-zinc-600">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={formData.new}
                onChange={(e) => setFormData({ ...formData, new: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:border-orange-500 text-zinc-700 transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <label className="text-zinc-600">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={formData.confirm}
                onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:border-orange-500 text-zinc-700 transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 text-sm">
          <button 
            type="button"
            onClick={() => setIsChanging(false)}
            className="px-4 py-2 text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#E85A28] text-white rounded-lg hover:bg-[#D14F23] transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
