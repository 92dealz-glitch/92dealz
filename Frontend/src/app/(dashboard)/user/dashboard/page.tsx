"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Store, 
  Wallet, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { getMarketerOverview } from "@/services/marketer.service";

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { label: "Total Marketers", value: "0", trend: "+0%", trendUp: true, icon: Users, color: "orange" },
    { label: "Total Vendors", value: "0", trend: "+0%", trendUp: true, icon: Store, color: "green" },
    { label: "Monthly Commission", value: "₦0", trend: "+0%", trendUp: true, icon: Wallet, color: "blue" },
    { label: "Target Progress", value: "0%", trend: "+0%", trendUp: true, icon: Target, color: "purple" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMarketerOverview();
        const d = res.data;
        const money = (n: number) => `₦${Number(n).toLocaleString()}`;
        setStats([
          { label: "Total Marketers", value: String(d.total_marketers), trend: "+0%", trendUp: true, icon: Users, color: "orange" },
          { label: "Total Vendors", value: String(d.total_vendors), trend: "+0%", trendUp: true, icon: Store, color: "green" },
          { label: "Monthly Commission", value: money(d.monthly_commission), trend: "+0%", trendUp: true, icon: Wallet, color: "blue" },
          { label: "Target Progress", value: `${d.target_progress}%`, trend: "+0%", trendUp: true, icon: Target, color: "purple" },
        ]);
      } catch {
        // keep defaults on error
      }
    })();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Dashboard Overview</h1>
        <p className="text-zinc-500 font-medium">Monitor your team performance and vendor acquisition</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                stat.color === 'orange' ? 'bg-orange-50 text-[#F05023]' :
                stat.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <span className="text-zinc-500 font-bold text-xs block mb-1 uppercase tracking-wider">{stat.label}</span>
              <span className="text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Performance Placeholder */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">Signup Performance</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">Daily marketer activity and vendor registration trends</p>
          </div>
          <div className="flex gap-4">
            <select className="bg-[#F9FAFB] border border-zinc-200 rounded-lg px-4 py-2 text-sm font-bold text-zinc-700 focus:border-[#F05023] outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>
        
        <div className="h-[400px] flex items-center justify-center bg-[#F9FAFB] rounded-xl border border-dashed border-zinc-200">
          <p className="text-zinc-400 font-bold">Chart integration coming soon...</p>
        </div>
      </div>
    </div>
  );
}
