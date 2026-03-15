"use client";

import React from "react";
import { 
  MousePointer2, 
  Eye, 
  RefreshCw, 
  TrendingUp,
  Download,
  Bell
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

const analyticsTrendData = [
  { name: "Jan 1", clicks: 320, views: 500, conversions: 120 },
  { name: "Jan 2", clicks: 250, views: 400, conversions: 80 },
  { name: "Jan 3", clicks: 280, views: 450, conversions: 100 },
  { name: "Jan 4", clicks: 450, views: 650, conversions: 180 },
  { name: "Jan 5", clicks: 380, views: 550, conversions: 150 },
  { name: "Jan 6", clicks: 220, views: 350, conversions: 90 },
  { name: "Jan 7", clicks: 350, views: 510, conversions: 130 },
];

const trafficSourceData = [
  { name: 'Google', value: 28, fill: '#EA4335' },
  { name: 'Direct', value: 35, fill: '#34A853' },
  { name: 'Social Media', value: 22, fill: '#FBBC05' },
  { name: 'Email', value: 10, fill: '#4285F4' },
  { name: 'Referral', value: 5, fill: '#A855F7' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Analytics & Tracking</h1>
          <p className="text-zinc-500 text-sm mt-1">Monitor platform performance and conversions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-semibold text-zinc-700">
            <Download size={16} />
            Report
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Clicks"
          value="8,932"
          icon={MousePointer2}
          trend={{ value: "↑ 20% from last period", isUp: true }}
          color="orange"
          bgColor="bg-[#22C55E]"
          iconColor="text-white"
        />
        <StatCard
          label="Total Views"
          value="32,454"
          icon={Eye}
          trend={{ value: "↑ 15% from last period", isUp: true }}
          color="green"
          bgColor="bg-[#22C55E]"
          iconColor="text-white"
        />
        <StatCard
          label="Conversions"
          value="400"
          icon={RefreshCw}
          trend={{ value: "↑ 10% from last period", isUp: true }}
          color="yellow"
          bgColor="bg-[#FACC15]"
          iconColor="text-white"
        />
        <StatCard
          label="Avg. CTR"
          value="25.8%"
          icon={TrendingUp}
          trend={{ value: "↑ 5% from last period", isUp: true }}
          color="purple"
          bgColor="bg-[#A855F7]"
          iconColor="text-white"
        />
      </div>

      {/* Main Trends Chart */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-zinc-900">Clicks & Conversions Trend</h3>
            <p className="text-xs text-zinc-500 mt-1">Track clicks, views, and conversions over time</p>
          </div>
          <button className="bg-[#E85A28] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
            Last 7 days
          </button>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="rect" align="left" />
              <Line type="monotone" dataKey="clicks" stroke="#E85A28" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Clicks" />
              <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Views" />
              <Line type="monotone" dataKey="conversions" stroke="#FACC15" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-6">Category Performance</h3>
          <div className="h-[300px] flex items-center justify-center text-zinc-400">
            {/* Bar chart placeholder */}
            [Bar Chart: Clicks vs Conversions per Category]
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-zinc-900 mb-6">Traffic Sources</h3>
          <div className="flex flex-col md:flex-row items-center gap-8 h-[300px]">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {trafficSourceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-sm font-medium text-zinc-900">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
