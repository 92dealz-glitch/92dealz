"use client";
import React, { useEffect, useState } from "react";
// Using native img here to avoid any remote loader issues for local uploads
import { Edit2, CheckCircle, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { listMyAds, deleteAd, markAdSold, updateAd } from "@/services/ads.service";
import { useAlert } from "@/context/AlertContext";

type Ad = { id: number; title: string; description?: string | null; price: number; image_url?: string | null; status?: string | null; createdAt?: string; subcategory?: string; specifications?: any };

export default function MyAdsList() {
    const { showAlert } = useAlert();
    const [activeTab, setActiveTab] = useState<"published" | "draft" | "closed">("published");
    const [items, setItems] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await listMyAds();
            setItems(res.data || []);
        } catch (e: any) {
            setError(e.message || "Failed to load ads");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-black font-black text-2xl">My Ads</h2>
                <Link
                    href="/vendor-dashboard/add-product"
                    className="bg-[#E85A28] hover:bg-[#D44D1F] text-white font-bold py-2.5 px-6 rounded-md flex items-center gap-2 transition-all duration-200"
                >
                    <Plus size={20} />
                    Add New
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-zinc-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {[
                    { id: "published", label: "Published", icon: CheckCircle },
                    { id: "draft", label: "Draft", icon: Edit2 },
                    { id: "closed", label: "Closed", icon: CheckCircle },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-4 font-bold text-[15px] transition-all relative ${activeTab === tab.id
                                ? "text-[#E85A28]"
                                : "text-zinc-500 hover:text-black"
                            }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? "text-[#E85A28]" : "text-zinc-400"} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E85A28]" />
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-6">
                {loading && <div className="text-sm text-zinc-500">Loading...</div>}
                {error && <div className="text-sm text-red-600">{error}</div>}
                {items.map((ad) => (
                    <div key={ad.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-zinc-100 hover:border-[#E85A28]/30 transition-all duration-300">
                        <div className="relative w-full md:w-48 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-50 border border-zinc-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ad.image_url || "/images/heroimage.svg"} alt={ad.title} className="absolute inset-0 w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-black font-black text-lg mb-1">{ad.title}</h3>
                                    <div className="text-[#E85A28] font-black text-xl mb-3">₦{Number(ad.price).toLocaleString()}</div>
                                    <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm font-bold">
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-xs">{new Date(ad.createdAt || Date.now()).toLocaleDateString()}</span>
                                        {ad.subcategory && <span className="text-[#E85A28] text-xs uppercase tracking-wider">{ad.subcategory}</span>}
                                    </div>
                                </div>
                                <span className="bg-[#10B981] text-white px-3 py-1 rounded-md text-[11px] font-black uppercase">
                                    {ad.status || "active"}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={async () => {
                                        const newTitle = prompt("Title", ad.title) ?? ad.title;
                                        const newPriceStr = prompt("Price", String(ad.price)) ?? String(ad.price);
                                        const newPrice = Number(newPriceStr);
                                        if (Number.isNaN(newPrice)) return;
                                        try {
                                            await updateAd(ad.id, { title: newTitle, price: newPrice });
                                            await load();
                                        } catch (e: any) {
                                            showAlert(e.message || "Action failed");
                                        }
                                    }}
                                    className="flex items-center gap-2 border border-zinc-300 hover:border-[#E85A28] hover:text-[#E85A28] text-zinc-700 font-bold py-1.5 px-4 rounded-md text-sm transition-all">
                                    <Edit2 size={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await markAdSold(ad.id);
                                            await load();
                                        } catch (e: any) {
                                            showAlert(e.message || "Failed to mark as sold");
                                        }
                                    }}
                                    className="flex items-center gap-2 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-bold py-1.5 px-4 rounded-md text-sm transition-all">
                                    Mark as sold
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!confirm("Delete this ad?")) return;
                                        try {
                                            await deleteAd(ad.id);
                                            await load();
                                        } catch (e: any) {
                                            showAlert(e.message || "Failed to delete ad");
                                        }
                                    }}
                                    className="flex items-center gap-2 border border-zinc-300 hover:border-red-500 hover:text-red-500 text-zinc-700 font-bold py-1.5 px-4 rounded-md text-sm transition-all">
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
