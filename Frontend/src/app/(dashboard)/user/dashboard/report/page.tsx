"use client";

import React from "react";
import { FileText, Download, Calendar, Filter, Plus } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-zinc-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Performance Reports</h1>
          <p className="text-zinc-500 font-medium">In-depth analytics and performance breakdowns</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-3 border border-zinc-200 bg-white font-bold py-3.5 px-8 rounded-xl hover:bg-zinc-50 transition-all shadow-sm">
             <Filter size={20} className="text-zinc-400" />
             Filters
           </button>
           <button className="flex items-center gap-3 bg-[#F05023] hover:bg-[#D44D1F] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-orange-100">
             <Plus size={20} className="hidden sm:block" />
             Generate Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center border-dashed">
           <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
              <FileText size={40} className="text-[#F05023]" />
           </div>
           <h3 className="text-xl font-bold mb-2">No Reports Generated</h3>
           <p className="text-zinc-400 font-medium text-sm max-w-xs mx-auto">Click the button above to generate a custom performance report for your team.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center border-dashed">
           <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <FileText size={40} className="text-[#059669]" />
           </div>
           <h3 className="text-xl font-bold mb-2">Archive Ready</h3>
           <p className="text-zinc-400 font-medium text-sm max-w-xs mx-auto">Historical data from February is now available in the archive section.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
        <h3 className="text-xl font-bold mb-8 pb-6 border-b border-zinc-100">Recent Reports</h3>
        <div className="space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center justify-between p-6 rounded-xl border border-zinc-50 hover:border-zinc-200 hover:bg-[#F9FAFB] transition-all group">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold">
                      PDF
                   </div>
                   <div>
                      <h4 className="font-bold text-lg group-hover:text-[#F05023] transition-colors">Marketer Performance Summary - Week {i}</h4>
                      <p className="text-zinc-400 text-sm font-medium">Generated: March {i}, 2026 • 2.4 MB</p>
                   </div>
                </div>
                <button className="text-zinc-400 hover:text-[#F05023] transition-colors">
                   <Download size={24} />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
