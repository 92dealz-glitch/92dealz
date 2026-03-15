"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  CheckCircle2, 
  FileEdit, 
  Calendar, 
  MousePointer2,
  Download,
  Bell
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { API_BASE } from "@/services/apiClient";
import VendorManagement from "@/components/admin/VendorManagement";

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clicksTrend, setClicksTrend] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        if (!token) return;

        // Fetch summary
        const res = await fetch(`${API_BASE}/admin/analytics/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const summary = await res.json();
        if (summary.success) {
          setData(summary.data);
        }

        // Fetch clicks trend
        const trendRes = await fetch(`${API_BASE}/admin/analytics/clicks-by-day`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const trend = await trendRes.json();
        if (trend.success) {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
          const mappedTrend = trend.data.slice(0, 7).reverse().map((d: any) => ({
            name: days[new Date(d.day).getDay()],
            clicks: d.views
          }));
          setClicksTrend(mappedTrend);
        }
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading overview...</div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Monitor your platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-semibold">
            <Download size={16} />
            Export
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Deals"
          value={String(data?.total_deals || 0)}
          icon={Package}
          trend={{ value: "+12%", isUp: true }}
          color="orange"
          bgColor="bg-[#E85A28]"
          iconColor="text-white"
        />
        <StatCard
          label="Published"
          value={String(data?.published || 0)}
          icon={CheckCircle2}
          color="green"
          bgColor="bg-[#22C55E]"
          iconColor="text-white"
        />
        <StatCard
          label="Draft"
          value={String(data?.drafts || 0)}
          icon={FileEdit}
          color="yellow"
          bgColor="bg-[#FACC15]"
          iconColor="text-white"
        />
        <StatCard
          label="Scheduled"
          value={String(data?.scheduled || 0)}
          icon={Calendar}
          trend={{ value: "2 upcoming", isUp: true }}
          color="purple"
          bgColor="bg-[#A855F7]"
          iconColor="text-white"
        />
        <StatCard
          label="Total Clicks"
          value={String(data?.total_views || 0)}
          icon={MousePointer2}
          trend={{ value: "+12%", isUp: true }}
          color="green"
          bgColor="bg-[#22C55E]"
          iconColor="text-white"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900">Clicks Trend</h3>
            <button className="bg-[#E85A28] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
              Last 7 days
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clicksTrend}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85A28" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#E85A28" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#E85A28" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                  dot={{ r: 4, fill: '#E85A28', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#E85A28', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900">Deals by category</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.categories || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                  {(data?.categories || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill="#FACC15" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <VendorManagement />

      {/* Recent Deals Table Placeholder */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-zinc-900">Recent Deals</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Latest deals added to the platform</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Deal Title</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Clicks</th>
                <th className="px-6 py-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {(data?.recentDeals || []).map((deal: any) => (
                <tr key={deal.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{deal.title}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{deal.merchant || "Unknown"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-white text-[11px] font-bold rounded ${
                      deal.status === 'active' ? 'bg-[#10B981]' : 
                      deal.status === 'draft' ? 'bg-[#FACC15]' : 'bg-[#A855F7]'
                    }`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 text-right">{deal.views?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 text-right">{new Date(deal.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!data?.recentDeals || data.recentDeals.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-zinc-400 font-bold">No deals recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
