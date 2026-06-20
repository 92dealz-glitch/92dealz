"use client";
import React from "react";
import { PlusCircle, Package, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
    return (
        <div className="bg-white rounded-lg p-6 border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] mb-6">
            <h3 className="text-black font-black text-lg mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                    href="/vendor-dashboard/add-product"
                    className="flex items-center justify-center gap-2 bg-[#708238] hover:bg-[#5E6E2F] text-white font-bold py-3 px-4 rounded-md transition-all duration-200"
                >
                    <PlusCircle size={20} />
                    Add New Product
                </Link>
                <Link 
                    href="/vendor-dashboard/my-ads"
                    className="flex items-center justify-center gap-2 bg-white border border-zinc-300 text-zinc-800 font-bold py-3 px-4 rounded-md transition-all duration-200 hover:border-[#708238] hover:text-[#708238]"
                >
                    <Package size={20} />
                    View My Ads
                </Link>
                <Link 
                    href="/vendor-dashboard/analytics"
                    className="flex items-center justify-center gap-2 bg-white border border-zinc-300 text-zinc-800 font-bold py-3 px-4 rounded-md transition-all duration-200 hover:border-[#708238] hover:text-[#708238]"
                >
                    <BarChart2 size={20} />
                    View Analytics
                </Link>
            </div>
        </div>
    );
}



