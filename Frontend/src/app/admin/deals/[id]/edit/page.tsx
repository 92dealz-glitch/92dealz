"use client";

import React, { useEffect, useState } from "react";
import DealForm from "@/components/dashboard/DealForm";
import { getAdById } from "@/services/ads.service";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminEditDealPage() {
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
            <div className="flex flex-col items-center justify-center min-h-screen py-20">
                <Loader2 className="animate-spin text-orange-600 mb-2" size={40} />
                <p className="text-zinc-500 font-bold">Loading ad details...</p>
            </div>
        );
    }

    if (error || !deal) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 font-bold mb-4">{error || "Ad not found"}</p>
                <Link href="/admin/deals" className="text-orange-600 font-black hover:underline uppercase text-sm">
                    Back to Product Management
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/deals" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black font-bold text-sm transition-colors mb-4">
                    <ArrowLeft size={18} />
                    Back to Management
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-black">Edit Ad <span className="text-orange-500">#{id}</span></h1>
                <p className="text-zinc-500 text-sm font-medium">As an admin, you are editing this listing on behalf of the vendor.</p>
            </div>

            <DealForm initialData={deal} isEdit={true} isAdmin={true} />
        </div>
    );
}
