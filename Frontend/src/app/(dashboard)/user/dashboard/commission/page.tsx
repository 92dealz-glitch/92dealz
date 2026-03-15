"use client";

import React, { useEffect, useState } from "react";
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Download, Plus } from "lucide-react";
import { API_BASE } from "@/services/apiClient";

export default function CommissionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        if (!token) return;
        const res = await fetch(`${API_BASE}/marketer/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Failed to load commission data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading earnings...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Commission & Earnings</h1>
          <p className="text-zinc-500 font-medium">Track your earnings and payout history</p>
        </div>
        <button className="flex items-center gap-3 bg-[#F05023] hover:bg-[#D44D1F] box-border text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-orange-100">
          <Plus size={20} className="hidden sm:block" />
          Export Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-orange-50 text-[#F05023]">
              <Wallet size={24} />
            </div>
            <span className="text-[#059669] font-bold text-[10px] bg-[#D1FAE5] px-3 py-1 rounded-full uppercase tracking-wider">Available</span>
          </div>
          <span className="text-zinc-400 font-bold text-[10px] uppercase block mb-1 tracking-widest">Total Balance</span>
          <span className="text-4xl font-black text-zinc-900 tracking-tight">₦{(data?.total_balance || 0).toLocaleString()}</span>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-emerald-50 text-[#059669]">
              <TrendingUp size={24} />
            </div>
            <div className="flex items-center gap-1 text-[#059669] font-bold text-xs">
              <ArrowUpRight size={16} />
              +12.5%
            </div>
          </div>
          <span className="text-zinc-400 font-bold text-[10px] uppercase block mb-1 tracking-widest">Expected Payout</span>
          <span className="text-4xl font-black text-zinc-900 tracking-tight">₦{(data?.payout_expected || 0).toLocaleString()}</span>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Wallet size={24} />
            </div>
          </div>
          <span className="text-zinc-400 font-bold text-[10px] uppercase block mb-1 tracking-widest">Last Payout</span>
          <span className="text-4xl font-black text-zinc-900 tracking-tight">₦{(data?.last_payout || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8">
        <h3 className="text-xl font-bold text-zinc-900 mb-8 pb-6 border-b border-zinc-100">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-zinc-200">
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {(data?.transactions || []).map((item: any) => (
                <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-6 text-zinc-500 text-sm whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-6 text-zinc-900 font-bold">{item.source}</td>
                  <td className="px-6 py-6 text-zinc-900 text-lg font-bold">{item.amount}</td>
                  <td className="px-6 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Paid' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FFF7ED] text-[#EA580C]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.transactions || data.transactions.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-zinc-400 font-bold">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
