"use client";

import React, { useEffect, useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { getMyProfile } from "@/lib/api";

export default function ChangeEmailForm() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("Loading...");
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    getMyProfile().then((res: any) => {
      if (res?.data?.email) setCurrentEmail(res.data.email);
    }).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification("error", "Please enter a valid email address.");
      return;
    }
    
    // Success simulation
    showNotification("success", "Email changed successfully. Please verify your new email.");
    setEmail("");
    setIsChanging(false);
  };

  if (!isChanging) {
    return (
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl border border-zinc-100 shadow-sm">
            <Mail size={20} className="text-[#E85A28]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-zinc-900">Email Address</span>
            <span className="text-sm text-zinc-500 font-medium">{currentEmail}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-zinc-500/10 text-zinc-500 text-[10px] uppercase rounded leading-none">Not Verified</span>
          <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-xs font-bold text-zinc-700 shadow-sm">Verify</button>
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
      <h4 className="text-sm text-zinc-900 mb-4">Change Email Address</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-sm">
          <label className="text-zinc-600">New Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter new email"
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
            className="px-6 py-2 bg-[#E85A28] text-white rounded-lg hover:bg-[#D14F23] transition-colors shadow-sm"
          >
            Change Email
          </button>
        </div>
      </form>
    </div>
  );
}

