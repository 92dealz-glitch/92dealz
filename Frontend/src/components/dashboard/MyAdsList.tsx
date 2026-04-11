"use client";
import React, { useEffect, useState } from "react";
// Using native img here to avoid any remote loader issues for local uploads
import { Edit2, CheckCircle, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { listMyAds, deleteAd, markAdSold, updateAd, updateAdVisibility } from "@/services/ads.service";
import { getProfile } from "@/services/user.service";
import { UserProfile } from "@/lib/api";
import { useAlert } from "@/context/AlertContext";

type Ad = { id: number; title: string; description?: string | null; price: number; image_url?: string | null; status?: string | null; createdAt?: string; subcategory?: string; specifications?: any; plan_type?: 'free' | 'basic' | 'star' };

export default function MyAdsList() {
    const { showAlert, showConfirm, showPrompt } = useAlert();
    const [activeTab, setActiveTab] = useState<"published" | "pending" | "draft" | "closed" | "rejected">("published");
    const [items, setItems] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [promotingId, setPromotingId] = useState<number | null>(null);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            // Map "published" tab to "active" status for the API
            const statusMap: Record<string, string> = {
                published: "active",
                pending: "pending",
                draft: "draft",
                closed: "sold",
                rejected: "rejected"
            };
            const res = await listMyAds(statusMap[activeTab]);
            setItems(res.data || []);
            
            const profRes = await getProfile();
            if (profRes.success) {
                setProfile(profRes.data);
            }
        } catch (e: any) {
            setError(e.message || "Failed to load ads");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [activeTab]);

    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-black font-black text-2xl">My Ads</h2>
                <Link
                    href="/vendor-dashboard/add-product"
                    className="bg-[#f45c03] hover:bg-[#f45c03] text-white font-bold py-2.5 px-6 rounded-md flex items-center gap-2 transition-all duration-200"
                >
                    <Plus size={20} />
                    Add New
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-zinc-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {[
                    { id: "published", label: "Published", icon: CheckCircle },
                    { id: "pending", label: "Pending", icon: Edit2 },
                    { id: "rejected", label: "Rejected", icon: Trash2 },
                    { id: "draft", label: "Draft", icon: Edit2 },
                    { id: "closed", label: "Closed", icon: CheckCircle },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-4 font-bold text-[15px] transition-all relative ${activeTab === tab.id
                                ? "text-[#f45c03]"
                                : "text-zinc-500 hover:text-black"
                            }`}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? "text-[#f45c03]" : "text-zinc-400"} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f45c03]" />
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-6">
                {loading && <div className="text-sm text-zinc-500">Loading...</div>}
                {error && <div className="text-sm text-red-600">{error}</div>}
                {items.map((ad) => (
                    <div key={ad.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-zinc-100 hover:border-[#f45c03]/30 transition-all duration-300">
                        <div className="relative w-full md:w-48 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-50 border border-zinc-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ad.image_url || "/images/heroimage.svg"} alt={ad.title} className="absolute inset-0 w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-black font-black text-lg mb-1">{ad.title}</h3>
                                    <div className="text-[#f45c03] font-black text-xl mb-3">₦{Number(ad.price).toLocaleString()}</div>
                                    <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm font-bold">
                                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-xs">{new Date(ad.createdAt || Date.now()).toLocaleDateString()}</span>
                                        {ad.subcategory && <span className="text-[#f45c03] text-xs uppercase tracking-wider">{ad.subcategory}</span>}
                                    </div>
                                </div>
                                <span className={`text-white px-3 py-1 rounded-md text-[11px] font-black uppercase ${
                                    ad.status === 'pending' ? 'bg-orange-500' : 
                                    ad.status === 'rejected' ? 'bg-red-500' : 'bg-[#10B981]'
                                }`}>
                                    {ad.status || "active"}
                                </span>
                                {ad.plan_type && ad.plan_type !== 'free' && (
                                    <span className={`ml-2 px-3 py-1 rounded-md text-[11px] font-black uppercase flex items-center gap-1.5 shadow-sm ${
                                        ad.plan_type === 'star' ? 'bg-yellow-400 text-black ring-2 ring-yellow-100' : 'bg-orange-500 text-white shadow-orange-100'
                                    }`}>
                                        {ad.plan_type === 'star' ? (
                                            <>
                                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                                Star Premium
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                                Basic Boost
                                            </>
                                        )}
                                    </span>
                                )}
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={async () => {
                                        const newTitle = await showPrompt("Enter new title", ad.title, "Edit Title") ?? ad.title;
                                        if (newTitle.length > 70) {
                                            showAlert("Title must be at most 70 characters.", "Oops!");
                                            return;
                                        }
                                        const newPriceStr = await showPrompt("Enter new price", String(ad.price), "Edit Price") ?? String(ad.price);
                                        const newPrice = Number(newPriceStr);
                                        if (Number.isNaN(newPrice)) return;
                                        try {
                                            await updateAd(ad.id, { title: newTitle, price: newPrice });
                                            await load();
                                        } catch (e: any) {
                                            showAlert(e.message || "Action failed");
                                        }
                                    }}
                                    className="flex items-center gap-2 border border-zinc-300 hover:border-[#f45c03] hover:text-[#f45c03] text-zinc-700 font-bold py-1.5 px-4 rounded-md text-sm transition-all">
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
                                        if (!await showConfirm("Are you sure you want to delete this ad?", "Confirm Deletion")) return;
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
                                {ad.status === 'active' && ad.plan_type === 'free' && (
                                    <button
                                        onClick={() => {
                                            setPromotingId(ad.id);
                                            setIsPromoteModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-[#f45c03] to-orange-600 text-white font-black py-1.5 px-6 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-orange-100 active:scale-95">
                                        <Plus size={16} />
                                        Promote Ad
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Promote Modal */}
            {isPromoteModalOpen && promotingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full animate-in zoom-in-95 duration-200 relative shadow-2xl">
                        <button
                            onClick={() => setIsPromoteModalOpen(false)}
                            className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="mb-8">
                            <h3 className="text-3xl font-black text-black mb-2">Upgrade Visibility</h3>
                            <p className="text-zinc-500 font-bold">Choose a promotion tier for your ad to reach more buyers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <PromotionTierCard 
                                id="basic"
                                title="Featured Boost"
                                perk="Appears in Trending Ads"
                                disabled={profile?.subscription_plan === 'free'}
                                slots={`${profile?.subscription_stats?.basic || 0} / ${profile?.subscription_stats?.limits?.basic || 10}`}
                                onSelect={async () => {
                                    try {
                                        await updateAdVisibility(promotingId, 'basic');
                                        showAlert("Ad promoted to Featured Boost!", "Success");
                                        setIsPromoteModalOpen(false);
                                        load();
                                    } catch (e: any) {
                                        showAlert(e.message || "Failed to promote");
                                    }
                                }}
                            />
                            <PromotionTierCard 
                                id="star"
                                title="Star Premium"
                                perk="Hot Deals & Featured Section"
                                disabled={profile?.subscription_plan !== 'star'}
                                slots={`${profile?.subscription_stats?.star || 0} / ${profile?.subscription_stats?.limits?.star || 20}`}
                                onSelect={async () => {
                                    try {
                                        await updateAdVisibility(promotingId, 'star');
                                        showAlert("Ad promoted to Star Premium!", "Success");
                                        setIsPromoteModalOpen(false);
                                        load();
                                    } catch (e: any) {
                                        showAlert(e.message || "Failed to promote");
                                    }
                                }}
                            />
                        </div>

                        {profile?.subscription_plan === 'free' && (
                            <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Star className="text-orange-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-orange-900">Subscription Required</p>
                                    <p className="text-xs font-bold text-orange-700">You need a Basic or Star plan to use these tiers.</p>
                                </div>
                                <Link href="/pricing" className="ml-auto bg-black text-white px-5 py-2 rounded-xl text-xs font-black">Upgrade</Link>
                            </div>
                        )}

                        <button
                            onClick={() => setIsPromoteModalOpen(false)}
                            className="w-full py-4 text-zinc-500 font-black hover:text-black transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PromotionTierCard({ title, perk, disabled, slots, onSelect, id }: { title: string, perk: string, disabled: boolean, slots: string, onSelect: () => void, id: string }) {
    return (
        <div className={`p-6 rounded-[24px] border-2 flex flex-col items-start gap-4 transition-all ${disabled ? 'border-zinc-100 opacity-50 bg-zinc-50' : 'border-zinc-200 hover:border-orange-500 hover:bg-orange-50/30'}`}>
            <div className={`p-3 rounded-2xl ${id === 'star' ? 'bg-yellow-100 text-yellow-600' : 'bg-orange-100 text-orange-600'}`}>
                {id === 'star' ? <Star size={24} /> : <Zap size={24} />}
            </div>
            <div>
                <h4 className="text-xl font-black text-black mb-1">{title}</h4>
                <p className="text-zinc-500 font-bold text-xs">{perk}</p>
            </div>
            {!disabled ? (
                <>
                    <div className="mt-2 w-full">
                        <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 mb-1">
                            <span>Used Slots</span>
                            <span>{slots}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onSelect}
                        className="w-full mt-4 bg-black text-white py-3 rounded-xl font-black text-sm hover:bg-zinc-800 active:scale-95 transition-all"
                    >
                        Activate Now
                    </button>
                </>
            ) : (
                <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                    <Lock size={12} />
                    Plan Required
                </div>
            )}
        </div>
    );
}

function X(props: any) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    )
}

function Zap(props: any) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    )
}

function Star(props: any) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    )
}

function Lock(props: any) {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    )
}

