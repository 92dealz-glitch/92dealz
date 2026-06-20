"use client";

import React from "react";
import DealForm from "@/components/admin/deals/DealForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddDealPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add New Deal</h1>
          <p className="text-zinc-500 text-sm mt-1">Create a new promotion on the platform</p>
        </div>
      </div>

      <Link 
        href="/admin/deals" 
        className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#708238] text-[#708238] rounded-lg text-sm font-bold hover:bg-[#E9E0D4] transition-colors"
      >
        <ChevronLeft size={18} />
        Back to deals
      </Link>

      <DealForm type="add" />
    </div>
  );
}


