"use client";

import React, { useState, useMemo } from "react";
import { 
  Shield, 
  Eye, 
  FileCheck, 
  Cpu,
  Search,
  ChevronDown,
  Download,
  Bell,
  DownloadCloud
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";

const initialAuditLogs = [
  { id: 1, timestamp: "2026-03-02 14:32:15", admin: "Admin User", email: "admin@234deals.com", action: "published", type: "deal", target: "Samsung Galaxy DEL001", details: "Changed status from draft to published", ip: "197.210.52.45" },
  { id: 2, timestamp: "2026-03-02 12:15:42", admin: "System", email: "system@234deals.com", action: "created", type: "merchant", target: "TechHub Nigeria MER005", details: "Deal expired automatically", ip: "System" },
  { id: 3, timestamp: "2026-03-01 23:59:59", admin: "Admin User", email: "admin@234deals.com", action: "unpublished", type: "deal", target: "Summer Fashion DEL045", details: "Deal expired automatically", ip: "197.210.52.45" },
  { id: 4, timestamp: "2026-03-01 22:15:10", admin: "Admin User", email: "admin@234deals.com", action: "updated", type: "settings", target: "Platform Settings SET001", details: "Updated pricing and description", ip: "197.210.52.45" },
  { id: 5, timestamp: "2026-03-01 20:45:00", admin: "Admin User", email: "admin@234deals.com", action: "deleted", type: "deal", target: "Old Product Deal DEL089", details: "-", ip: "197.210.52.45" },
  { id: 6, timestamp: "2026-03-01 18:30:25", admin: "Admin User", email: "admin@234deals.com", action: "restored", type: "deal", target: "Apple MacBook Pro DEL034", details: "Restored from trash", ip: "197.210.52.45" },
  { id: 7, timestamp: "2026-03-01 15:12:00", admin: "Admin User", email: "admin@234deals.com", action: "created", type: "category", target: "Electronics CAT012", details: "-", ip: "197.210.52.45" },
];

const actionStyles = {
  published: "bg-[#0EA5E9] text-white",
  created: "bg-[#0EA5E9] text-white",
  unpublished: "bg-[#0EA5E9] text-white",
  updated: "bg-[#0EA5E9] text-white",
  deleted: "bg-red-500 text-white",
  restored: "bg-[#0EA5E9] text-white",
};

const ACTION_OPTIONS = ["All Actions", "Published", "Created", "Unpublished", "Updated", "Deleted", "Restored"];
const TYPE_OPTIONS = ["All Types", "Deal", "Category", "Merchant", "Tag", "User", "Settings"];

export default function AuditLogsPage() {
  const [selectedAction, setSelectedAction] = useState("All Actions");
  const [selectedType, setSelectedType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = useMemo(() => {
    return initialAuditLogs.filter(log => {
      const matchAction = selectedAction === "All Actions" || log.action.toLowerCase() === selectedAction.toLowerCase();
      const matchType = selectedType === "All Types" || log.type.toLowerCase() === selectedType.toLowerCase();
      const matchSearch = log.admin.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchAction && matchType && matchSearch;
    });
  }, [selectedAction, selectedType, searchQuery]);

  const handleExport = () => {
    const jsonString = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Audit Logs</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-[#f45c03] text-[#f45c03] rounded-lg bg-white hover:bg-orange-50 transition-colors text-sm font-bold shadow-sm active:scale-95"
          >
            <Download size={16} />
            Export
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-6 font-bold">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg text-zinc-900">Audit Logs</h2>
            <p className="text-sm text-zinc-500 font-medium">Track all administrative actions and system events</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-bold text-zinc-700 shadow-sm"
          >
            <DownloadCloud size={18} />
            Export Logs
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Actions" value={filteredLogs.length} icon={Shield} color="orange" bgColor="bg-[#f45c03]" iconColor="text-white" />
          <StatCard label="Today" value="2" icon={Eye} color="green" bgColor="bg-[#22C55E]" iconColor="text-white" />
          <StatCard label="Active Admins" value="1" icon={FileCheck} color="yellow" bgColor="bg-[#FACC15]" iconColor="text-white" />
          <StatCard label="System Actions" value="1" icon={Cpu} color="purple" bgColor="bg-[#A855F7]" iconColor="text-white" />
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin, deal or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors text-sm font-medium"
            />
          </div>
          <div className="relative w-full lg:w-48">
            <select 
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 outline-none text-sm font-bold text-zinc-700 focus:border-orange-500 cursor-pointer"
            >
              {ACTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
          </div>
          <div className="relative w-full lg:w-48">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 outline-none text-sm font-bold text-zinc-700 focus:border-orange-500 cursor-pointer"
            >
              {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-zinc-100 rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4 text-center">Action</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-500 font-medium whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">{log.admin}</span>
                      <span className="text-[11px] text-zinc-400 font-medium">{log.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase ${actionStyles[log.action as keyof typeof actionStyles]}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 font-bold">{log.type}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 font-medium max-w-[150px] truncate">{log.target}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 font-medium max-w-[200px] truncate">{log.details}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 font-medium text-right">{log.ip}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-zinc-400 font-medium">
                    No logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

