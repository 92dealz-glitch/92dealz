"use client";

import React, { useEffect, useState } from "react";
import DealForm from "@/components/dashboard/DealForm";
import { getAdById } from "@/services/ads.service";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function VendorEditAdPage() {
    const { id } = useParams();
    const [deal, setDeal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        getAdById(Number(id))
            .then(res => {
                if (res.success) setDeal(res.data);
                else setError("Failed to load ad details");
            })
            .catch(err => {
                console.error(err);
                setError("An error occurred while fetching ad data");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-orange-600 mb-2" size={32} />
                <p className="text-zinc-500 font-bold">Loading ad details...</p>
            </div>
        );
    }

    if (error || !deal) {
        return (
            <div className="p-8 text-center bg-white rounded-xl border border-zinc-200">
                <p className="text-red-500 font-bold mb-4">{error || "Ad not found"}</p>
                <Link href="/vendor-dashboard/my-ads" className="text-orange-600 font-black hover:underline uppercase text-sm">
                    Back to My Ads
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-black">Edit Listing</h1>
                    <p className="text-zinc-500 text-sm font-medium">Update your product details, photos, and location.</p>
                </div>
                <Link href="/vendor-dashboard/my-ads" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black font-bold text-sm transition-colors">
                    <ArrowLeft size={18} />
                    Back
                </Link>
            </div>

            <DealForm initialData={deal} isEdit={true} isAdmin={false} />
        </div>
    );
}
