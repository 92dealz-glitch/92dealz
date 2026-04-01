"use client";

import React, { useState } from "react";
import { Phone, CheckCircle2 } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

export default function ChangePhoneForm() {
  const { showNotification } = useNotification();
  const [phone, setPhone] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      showNotification("error", "Please enter a valid phone number.");
      return;
    }
    
    // Success simulation
    showNotification("success", "Phone number changed successfully. Please verify your new number.");
    setPhone("");
    setIsChanging(false);
  };

  if (!isChanging) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
            <Phone size={20} className="text-[#f45c03]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-900">Phone Number</span>
            <span className="text-sm text-zinc-500 font-medium">+234 801 234 0600</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#10B981] text-white text-[10px] uppercase rounded leading-none">
            <CheckCircle2 size={12} />
            Verified
          </span>
          <button 
            onClick={() => setIsChanging(true)}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 shadow-sm"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-50 border border-orange-500/20 rounded-2xl animate-in fade-in duration-300 font-bold">
      <h4 className="text-sm text-zinc-900 mb-4">Change Phone Number</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-sm">
          <label className="text-zinc-600">New Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="enter new phone number"
            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-lg outline-none focus:border-orange-500 text-zinc-700 transition-colors"
          />
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
            className="px-6 py-2 bg-[#f45c03] text-white rounded-lg hover:bg-[#f45c03] transition-colors shadow-sm"
          >
            Change Phone
          </button>
        </div>
      </form>
    </div>
  );
}

