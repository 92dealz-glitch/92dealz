"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import DealForm from "@/components/admin/deals/DealForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDealById } from "@/lib/api";

export default function EditDealPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    
    async function loadDeal() {
      try {
        const res = await getDealById(Number(id));
        if (res.success) {
          setDeal(res.data);
        } else {
          setError("Failed to load deal details");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    loadDeal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Loading Deal Details...</p>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center my-8">
        <h2 className="text-red-900 font-black text-xl mb-2">Error Loading Deal</h2>
        <p className="text-red-600 mb-8 font-medium">{error || "Deal not found"}</p>
        <Link href="/admin/deals" className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-700 px-6 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">
          <ChevronLeft size={18} />
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Edit Deal <span className="text-orange-500">#{id}</span></h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium italic">Modify existing listing details and moderation state</p>
        </div>
      </div>

      <Link 
        href="/admin/deals" 
        className="inline-flex items-center gap-2 px-4 py-2 border border-[#708238] text-[#708238] rounded-xl text-sm font-black hover:bg-orange-50 transition-all active:scale-95"
      >
        <ChevronLeft size={18} />
        BACK TO TABLE
      </Link>

      <DealForm type="edit" initialData={deal} />
    </div>
  );
}
