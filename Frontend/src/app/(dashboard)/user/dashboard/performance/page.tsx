"use client";

import React, { useEffect, useState } from "react";
import { Download, Calendar, Search, ChevronDown } from "lucide-react";
import { API_BASE } from "@/services/apiClient";

export default function PerformancePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerformance() {
      try {
        const res = await fetch(`${API_BASE}/users?role=vendor`);
        const result = await res.json();
        if (result.success) {
          // Group vendors by date and marketer (Admin for now)
          const grouped: any = {};
          result.data.forEach((u: any) => {
            const date = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : "N/A";
            const key = `${date}-Admin`;
            if (!grouped[key]) {
              grouped[key] = {
                id: key,
                date,
                marketer: "Admin",
                signups: 0,
                status: "good"
              };
            }
            grouped[key].signups++;
          });

          const list = Object.values(grouped).sort((a: any, b: any) => b.date.localeCompare(a.date));
          list.forEach((item: any) => {
            if (item.signups >= 5) item.status = "excellent";
            else if (item.signups >= 2) item.status = "good";
            else item.status = "below average";
          });
          setData(list);
        }
      } catch (err) {
        console.error("Failed to load performance", err);
      } finally {
        setLoading(false);
      }
    }
    loadPerformance();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading performance stats...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Daily Performance</h1>
          <p className="text-zinc-500 font-medium">Track daily vendor signup performance</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 border border-zinc-200 bg-white text-zinc-900 font-bold py-3 px-8 rounded-xl hover:bg-zinc-50 transition-all shadow-sm">
            <Download size={20} className="text-[#F05023]" />
            Export
          </button>
          <div className="w-12 h-12 rounded-xl border border-zinc-200 flex items-center justify-center relative bg-white shadow-sm font-bold text-zinc-400">
             🔔
             <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F05023] rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12 pb-10 border-b border-zinc-100">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">Signup Tracking</h3>
            <p className="text-zinc-400 font-medium text-sm tracking-tight">Monitor detailed daily performance logs</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <select className="appearance-none pl-12 pr-12 py-3 bg-[#F9FAFB] border border-zinc-200 rounded-xl font-bold text-sm text-zinc-700 outline-none focus:border-[#F05023] cursor-pointer min-w-[180px]">
                   <option>Today</option>
                   <option>Yesterday</option>
                   <option>Last 7 Days</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
             </div>

             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <select className="appearance-none pl-12 pr-12 py-3 bg-[#F9FAFB] border border-zinc-200 rounded-xl font-bold text-sm text-zinc-700 outline-none focus:border-[#F05023] cursor-pointer min-w-[220px]">
                   <option>All Marketers</option>
                   <option>John Doe</option>
                   <option>Sarah Smith</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-zinc-200">
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Marketer Name</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Vendors Signed</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-8">
                    <span className="text-zinc-500 text-sm whitespace-nowrap">{item.date}</span>
                  </td>
                  <td className="px-6 py-8">
                    <span className="text-zinc-900 font-bold">{item.marketer}</span>
                  </td>
                  <td className="px-6 py-8">
                    <span className="text-zinc-900 text-lg font-black">{item.signups}</span>
                  </td>
                  <td className="px-6 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      item.status === 'excellent' ? 'bg-[#D1FAE5] text-[#059669]' :
                      item.status === 'good' ? 'bg-[#FFF7ED] text-[#EA580C]' :
                      'bg-zinc-100 text-zinc-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-8">
                    <p className="text-zinc-500 text-sm line-clamp-1 min-w-[200px]">
                       {item.status === 'excellent' ? "Great day, signed major retailers." : "Normal day, consistent progress."}
                    </p>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-zinc-400 font-bold">No performance logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
