"use client";

import React, { useEffect, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { API_BASE } from "@/services/apiClient";

type TeamStatus = "Online" | "Offline";
type PerformanceState = "On track" | "At risk" | "Below target";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch(`${API_BASE}/users?role=vendor`);
        const data = await res.json();
        if (data.success) {
          setMembers(data.data);
        }
      } catch (err) {
        console.error("Failed to load team", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading team...</div>;

  const onlineCount = members.filter(m => m.status === "Online").length;

  return (
    <div className="space-y-10 animate-in fade-in duration-600">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Team</h1>
          <div className="flex items-center gap-3">
             <span className="text-zinc-500 font-bold text-sm">{members.length} total</span>
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
             <span className="text-emerald-600 font-bold text-sm">{onlineCount} Online</span>
          </div>
        </div>
        <button className="flex items-center gap-3 bg-[#F05023] hover:bg-[#D44D1F] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-orange-100">
          <Plus size={20} />
          Add Marketer
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-xl font-black text-zinc-900 border-2 border-zinc-50">
                    {member.name.slice(0, 1)}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-4 border-white ${member.status === "Online" ? "bg-emerald-500" : "bg-zinc-300"}`}></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 mb-1">{member.name}</h3>
                  <p className="text-zinc-500 font-bold text-sm mb-2">{member.email}</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${member.status === "Online" ? "text-emerald-600" : "text-zinc-400"}`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                member.perf === "On track" ? "bg-emerald-50 text-emerald-600" : 
                member.perf === "At risk" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
              }`}>
                {member.perf}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-zinc-50/50 rounded-2xl p-6 mb-8 border border-zinc-100/50">
              <div className="text-center border-r border-zinc-200/50">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 text-center">Today</span>
                <span className="text-2xl font-black text-zinc-900">0</span>
              </div>
              <div className="text-center border-r border-zinc-200/50">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 text-center">Week</span>
                <span className="text-2xl font-black text-zinc-900">0</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 text-center">Ads</span>
                <span className="text-2xl font-black text-zinc-900">{member.total_ads}</span>
              </div>
            </div>

            <div className="relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden mb-8">
              <div className="absolute top-0 left-0 h-full bg-[#F05023] rounded-full" style={{ width: `${Math.min((member.total_ads / 50) * 100, 100)}%` }}></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2 text-zinc-400 font-bold text-sm hover:text-[#F05023] transition-colors">
              <Eye size={16} />
              Tap to view & manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
