"use client";
export const dynamic = "force-dynamic";

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
import nextDynamic from "next/dynamic";
import StatCard from "@/components/admin/StatCard";
import { API_BASE } from "@/services/apiClient";
import VendorManagement from "@/components/admin/VendorManagement";
import VendorApplications from "@/components/admin/VendorApplications";
import VendorVerificationRequests from "@/components/admin/VendorVerificationRequests";
import ProductManagement from "@/components/admin/ProductManagement";
import AdminReportManagement from "@/components/admin/AdminReportManagement";

// ─── Dynamic Recharts Imports (SSR-Safe) ──────────────────────────────────────
const ResponsiveContainer = nextDynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = nextDynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false });
const Area = nextDynamic(() => import("recharts").then(m => m.Area), { ssr: false });
const XAxis = nextDynamic(() => import("recharts").then(m => m.XAxis), { ssr: false });
const YAxis = nextDynamic(() => import("recharts").then(m => m.YAxis), { ssr: false });
const CartesianGrid = nextDynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false });
const Tooltip = nextDynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const BarChart = nextDynamic(() => import("recharts").then(m => m.BarChart), { ssr: false });
const Bar = nextDynamic(() => import("recharts").then(m => m.Bar), { ssr: false });
const Cell = nextDynamic(() => import("recharts").then(m => m.Cell), { ssr: false });

export default function AdminDashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clicksTrend, setClicksTrend] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
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

  if (loading || !isMounted) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading overview...</div>;

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
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={clicksTrend && clicksTrend.length > 0 ? clicksTrend : [{name: 'Loading', clicks: 0, views: 0}]}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85A28" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#E85A28" stopOpacity={0} />
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
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={data?.categories && data.categories.length > 0 ? data.categories : [{name: 'None', value: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

      {/* Poll Game Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900">Poll Question 1: Favorite Categories</h3>
            <span className="text-xs text-zinc-500 font-medium">Weekly Insights</span>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={data?.pollQ1 || []} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 500 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {(data?.pollQ1 || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#FF6B35" : "#E85A28"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-900">Poll Question 2: What makes users click?</h3>
            <span className="text-xs text-zinc-500 font-medium">Weekly Insights</span>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={data?.pollQ2 || []} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 500 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {(data?.pollQ2 || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#FF6B35" : "#E85A28"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <VendorManagement />
      <VendorApplications />
      <VendorVerificationRequests />
      <ProductManagement />
      <AdminReportManagement />
    </div>
  );
}
