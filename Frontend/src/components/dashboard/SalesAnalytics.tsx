"use client";
import React, { useEffect, useState } from "react";
import { getWeeklyAnalytics } from "@/services/analytics.service";

export default function SalesAnalytics() {
    const [activeFilter, setActiveFilter] = useState("Weekly");
    const [series, setSeries] = useState<{day:string; visitors:number; contact_views:number; chats:number}[]>([]);

    const maxVal = Math.max(...series.flatMap(d => [d.visitors, d.contact_views, d.chats]), 10);
    const yAxisLabels = [maxVal, Math.floor(maxVal * 0.8), Math.floor(maxVal * 0.6), Math.floor(maxVal * 0.4), Math.floor(maxVal * 0.2), 0];

    useEffect(() => {
        (async () => {
            try {
                const r = await getWeeklyAnalytics();
                const rows = (r.data || []) as any[];
                const formatted = rows.map(x => ({
                    day: new Date(x.day).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
                    visitors: x.visitors || 0,
                    contact_views: x.contact_views || 0,
                    chats: x.chats || 0,
                }));
                setSeries(formatted);
            } catch {}
        })();
    }, []);

    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                <div>
                    <h2 className="text-black font-black text-2xl mb-1">Sales Analytics</h2>
                    <p className="text-zinc-500 font-bold text-sm">Here&apos;s how your ads performed</p>
                </div>

                <div className="bg-zinc-50 p-1.5 rounded-lg flex items-center gap-1 border border-zinc-100">
                    {["Daily", "Weekly", "Monthly"].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-6 py-2 rounded-md font-bold text-xs transition-all ${activeFilter === f
                                    ? "bg-[#E85A28] text-white shadow-md shadow-orange-100"
                                    : "text-zinc-500 hover:text-black"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-[400px] mt-8 w-full">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-bold text-zinc-400 w-12 text-right pr-4">
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                    <span>0</span>
                </div>

                {/* Chart Area */}
                <div className="ml-12 h-full border-b border-zinc-200 relative flex justify-between items-end pb-8">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 bottom-8 pointer-events-none flex flex-col justify-between py-1">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="w-full border-t border-dashed border-zinc-200" />
                        ))}
                    </div>

                    {/* Bars */}
                    {series.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div className="flex items-end gap-1.5 h-full relative z-10">
                                <div
                                    className="w-2.5 rounded-sm bg-[#10B981] transition-all duration-700 delay-100"
                                    style={{ height: `${Math.min(100, d.visitors)}%` }}
                                />
                                <div
                                    className="w-2.5 rounded-sm bg-[#E85A28] transition-all duration-700 delay-300"
                                    style={{ height: `${Math.min(100, d.contact_views)}%` }}
                                />
                                <div
                                    className="w-2.5 rounded-sm bg-[#3B82F6] transition-all duration-700 delay-500"
                                    style={{ height: `${Math.min(100, d.chats)}%` }}
                                />
                            </div>
                            <span className="absolute bottom-0 text-[11px] font-black text-zinc-500 mt-4">{series[i]?.day || ""}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-12 space-y-4 max-w-xs">
                <LegendItem color="#10B981" label="Visitors" checked />
                <LegendItem color="#E85A28" label="Contact views" checked />
                <LegendItem color="#3B82F6" label="Chats" checked />
            </div>
        </div>
    );
}

function LegendItem({ color, label, checked = false }: { color: string, label: string, checked?: boolean }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-zinc-600 font-bold text-[14px]">{label}</span>
            </div>
            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${checked ? "bg-[#E85A28] border-[#E85A28]" : "bg-white border-zinc-300 border"
                }`}>
                {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <input type="checkbox" className="hidden" checked={checked} readOnly />
        </label>
    )
}
