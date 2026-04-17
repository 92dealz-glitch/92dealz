"use client";
import React, { useEffect, useState } from "react";
// Using native img here to avoid any remote loader issues for local uploads
import { Edit2, CheckCircle, Trash2, Plus, Timer, Lock, Star, Zap, X, Clock, Info } from "lucide-react";
import Link from "next/link";
import { listMyAds, deleteAd, markAdSold, updateAd, updateAdVisibility } from "@/services/ads.service";
import { getProfile } from "@/services/user.service";
import { UserProfile } from "@/lib/api";
import { useAlert } from "@/context/AlertContext";

type Ad = { id: number; title: string; description?: string | null; price: number; image_url?: string | null; status?: string | null; createdAt?: string; subcategory?: string; specifications?: any; plan_type?: 'free' | 'basic' | 'star' | 'premium'; is_contacted?: boolean; is_locked?: boolean; active_until?: string };

export default function MyAdsList() {
    const { showAlert, showConfirm, showPrompt } = useAlert();
    const [activeTab, setActiveTab] = useState<"published" | "pending" | "draft" | "closed" | "rejected">("published");
    const [items, setItems] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [promotingId, setPromotingId] = useState<number | null>(null);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const isChina = profile?.country_name === 'China' || profile?.country_code === 'CN';

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

            {/* Stats Summary */}
            {profile?.subscription_stats && (
                <div className="flex flex-wrap gap-4 mb-8">
                    {!isChina && (
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 flex flex-col min-w-[120px]">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Free Slots</span>
                            <span className="text-lg font-black text-black">{profile.subscription_stats.free} / {profile.subscription_stats.limits.free}</span>
                        </div>
                    )}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex flex-col min-w-[120px]">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">{isChina ? "Featured Tier" : "Featured"}</span>
                        <span className="text-lg font-black text-[#f45c03]">{profile.subscription_stats.basic} / {profile.subscription_stats.limits.basic}</span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 flex flex-col min-w-[120px]">
                        <span className="text-[10px] font-black text-yellow-600 uppercase tracking-wider">{isChina ? "Premium Tier" : "Star"}</span>
                        <span className="text-lg font-black text-yellow-600">{profile.subscription_stats.star} / {profile.subscription_stats.limits.star}</span>
                    </div>
                    {(!isChina && (profile.subscription_stats.limits.premium > 0 || profile.subscription_plan === 'premium')) && (
                        <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex flex-col min-w-[120px]">
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">Ultimate</span>
                            <span className="text-lg font-black text-purple-600">{profile.subscription_stats.premium} / ∞</span>
                        </div>
                    )}
                    {(!isChina && profile?.extra_slots_purchased && profile.extra_slots_purchased > 0) && (
                         <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex flex-col min-w-[120px] border-dashed">
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Starter Add-ons</span>
                             <span className="text-lg font-black text-emerald-600">+{profile.extra_slots_purchased} Purchased</span>
                         </div>
                    )}
                </div>
            )}

            {profile?.subscription_plan === 'free' && (
                <div className="mb-8 p-6 bg-black rounded-[24px] border-l-8 border-[#f45c03] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f45c03]/10 rounded-full flex items-center justify-center shrink-0">
                            <Info size={24} className="text-[#f45c03]" />
                        </div>
                        <div>
                            <p className="text-white font-black text-lg">Action Required: Plan Expired</p>
                            <p className="text-zinc-400 font-bold text-sm">All your products are currently hidden from the public. Subscribe to a plan to bring them back online.</p>
                        </div>
                    </div>
                    <Link href="/pricing" className="bg-[#f45c03] text-white px-8 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-orange-500/20 whitespace-nowrap">
                        Choose A Plan
                    </Link>
                </div>
            )}

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
                                        {ad.active_until && (
                                            <span className={`flex items-center gap-1 text-xs font-black ${new Date(ad.active_until) < new Date() ? 'text-red-500' : 'text-emerald-600'}`}>
                                                <Clock size={12} />
                                                {new Date(ad.active_until) < new Date() ? 'Expired' : `Visible until: ${new Date(ad.active_until).toLocaleDateString()}`}
                                            </span>
                                        )}
                                        {ad.subcategory && <span className="text-[#f45c03] text-xs uppercase tracking-wider">{ad.subcategory}</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-white px-3 py-1 rounded-md text-[11px] font-black uppercase ${
                                        ad.status === 'pending' ? 'bg-orange-500' : 
                                        ad.status === 'rejected' ? 'bg-red-500' : 'bg-[#10B981]'
                                    }`}>
                                        {ad.status || "active"}
                                    </span>
                                    {ad.active_until && new Date(ad.active_until) < new Date() && (
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await updateAd(ad.id, { active_until: 'reset' } as any);
                                                    window.location.reload();
                                                } catch (er: any) {
                                                    alert(er.message || "Failed to renew ad.");
                                                }
                                            }}
                                            className="bg-black text-white px-3 py-1 rounded-md text-[11px] font-black uppercase hover:bg-zinc-800 transition-colors"
                                        >
                                            Renew Ad
                                        </button>
                                    )}
                                </div>
                                <span className={`ml-2 px-3 py-1 rounded-md text-[11px] font-black uppercase flex items-center gap-1.5 shadow-sm ${
                                    ad.plan_type === 'star' ? 'bg-yellow-400 text-black ring-2 ring-yellow-100' : 
                                    ad.plan_type === 'basic' ? 'bg-orange-500 text-white shadow-orange-100' : 
                                    ad.plan_type === 'premium' ? 'bg-purple-600 text-white shadow-purple-100 ring-2 ring-purple-100' :
                                    'bg-zinc-200 text-zinc-600'
                                }`}>
                                    {ad.plan_type === 'star' ? (
                                        <>
                                            <Star size={12} className="fill-current" />
                                            {isChina ? "Premium Tier" : "Star Premium"}
                                        </>
                                    ) : ad.plan_type === 'basic' ? (
                                        <>
                                            <Zap size={12} className="fill-current" />
                                            {isChina ? "Featured Tier" : "Featured Plan"}
                                        </>
                                    ) : ad.plan_type === 'premium' ? (
                                        <>
                                            <Star size={12} className="fill-current text-purple-200" />
                                            Ultimate Plan
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={12} className="fill-current opacity-50" />
                                            Standard Plan
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="mt-2 flex gap-2">
                                 {(ad.is_locked || ad.status === 'sold' || ad.is_contacted) && (
                                    <span 
                                        title="This ad is locked because it was recently contacted by a buyer or marked as sold. This prevents changing product details on a premium slot that has already generated leads."
                                        className="cursor-help bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1"
                                    >
                                        <Lock size={10} />
                                        Locked (Interacted)
                                    </span>
                                )}
                                {(ad.active_until && new Date(ad.active_until) < new Date()) && (
                                    <span 
                                        title="This listing has reached its 30-day lifecycle and is no longer visible to the public. You can renew it to reactivate it for another 30 days."
                                        className="cursor-help bg-zinc-100 text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-black uppercase"
                                    >
                                        Expired
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
                                        const cleanPrice = newPriceStr.replace(/\D/g, "");
                                        if (cleanPrice.length > 12) {
                                            showAlert("Price must be at most 12 digits.", "Oops!");
                                            return;
                                        }
                                        const newPrice = Number(cleanPrice);
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
                                        const isStrictLocked = ad.is_contacted || ad.status === 'sold' || ad.is_locked;
                                        const promptMsg = isStrictLocked 
                                          ? "This product has interacted with buyers and is permanently locked to prevent fraud. Deleting it will irrevocably close it and secure its slot. Proceed?" 
                                          : "Are you sure you want to delete this ad? It will be permanently removed.";
                                        if (!await showConfirm(promptMsg, "Confirm Deletion")) return;
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
                                {ad.status === 'active' && (
                                    <button
                                        onClick={() => {
                                            setPromotingId(ad.id);
                                            setIsPromoteModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-[#f45c03] to-orange-600 text-white font-black py-1.5 px-6 rounded-lg text-sm transition-all hover:shadow-lg hover:shadow-orange-100 active:scale-95">
                                        <Plus size={16} />
                                        Boost Ad
                                    </button>
                                )}
                                {(ad.active_until && new Date(ad.active_until) < new Date()) && (
                                    <button
                                        onClick={async () => {
                                            if (!await showConfirm("Renewing this ad will reactivate it for 30 days and bump it to the top. It will need to be re-approved by admins. Proceed?", "Renew Listing")) return;
                                            try {
                                                await updateAd(ad.id, { active_until: 'reset', status: 'pending' } as any);
                                                showAlert("Ad renewed successfully and sent for re-approval!", "Success");
                                                load();
                                            } catch (e: any) {
                                                showAlert(e.message || "Failed to renew ad. Ensure you have available slots.");
                                            }
                                        }}
                                        className="flex items-center gap-2 bg-black text-white font-black py-1.5 px-6 rounded-lg text-sm transition-all hover:bg-zinc-800 active:scale-95">
                                        <Timer size={16} />
                                        Renew Ad
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
                            <h3 className="text-3xl font-black text-black mb-2">Adjust Visibility</h3>
                            <p className="text-zinc-500 font-bold">Choose a visibility tier for your ad.</p>
                            {(() => {
                                const ad = items.find(a => a.id === promotingId);
                                const isLocked = ad?.is_locked || ad?.is_contacted || ad?.status === 'sold';
                                if (isLocked) {
                                    return (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                                            <Lock className="text-red-500" size={20} />
                                            <p className="text-xs font-bold text-red-700">
                                                This product is <span className="font-black underline">locked</span> because it has generated leads or interest. 
                                                Visibility cannot be changed to ensure consistency for interested buyers.
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {(() => {
                                const ad = items.find(a => a.id === promotingId);
                                const isLocked = ad?.is_locked || ad?.is_contacted || ad?.status === 'sold';
                                const adPlan = ad?.plan_type || 'free';

                                return (
                                    <>
                                        {!isChina && (
                                            <PromotionTierCard 
                                                id="free"
                                                title="Standard Tier"
                                                perk="Standard Visibility"
                                                disabled={isLocked}
                                                isActive={adPlan === 'free'}
                                                slots={`${profile?.subscription_stats?.free || 0} / ${profile?.subscription_stats?.limits?.free || 1}`}
                                                onSelect={async () => {
                                                    if (!promotingId) return;
                                                    try {
                                                        await updateAdVisibility(promotingId, 'free');
                                                        showAlert("Ad changed to Standard visibility!", "Success");
                                                        setIsPromoteModalOpen(false);
                                                        load();
                                                    } catch (e: any) {
                                                        showAlert(e.message || "Failed to switch plan");
                                                    }
                                                }}
                                            />
                                        )}
                                        <PromotionTierCard 
                                            id="basic"
                                            title={isChina ? "Featured Tier" : "Featured Boost"}
                                            perk={isChina ? "Priority Market Feed" : "Appears in Trending Ads"}
                                            disabled={isLocked || !profile?.basic_plan_expires_at || new Date(profile.basic_plan_expires_at || 0) < new Date()}
                                            isActive={adPlan === 'basic'}
                                            slots={`${profile?.subscription_stats?.basic || 0} / ${profile?.subscription_stats?.limits?.basic || 10}`}
                                            onSelect={async () => {
                                                if (!promotingId) return;
                                                try {
                                                    await updateAdVisibility(promotingId, 'basic');
                                                    showAlert(isChina ? "Ad updated to Featured Tier!" : "Ad changed to Featured Boost!", "Success");
                                                    setIsPromoteModalOpen(false);
                                                    load();
                                                } catch (e: any) {
                                                    showAlert(e.message || "Failed to switch plan");
                                                }
                                            }}
                                        />
                                        <PromotionTierCard 
                                            id="star"
                                            title={isChina ? "Premium Tier" : "Star Premium"}
                                            perk={isChina ? "Maximum Export Visibility" : "Hot Deals & Featured Section"}
                                            disabled={isLocked || !profile?.star_plan_expires_at || new Date(profile.star_plan_expires_at || 0) < new Date()}
                                            isActive={adPlan === 'star'}
                                            slots={`${profile?.subscription_stats?.star || 0} / ${profile?.subscription_stats?.limits?.star || 20}`}
                                            onSelect={async () => {
                                                if (!promotingId) return;
                                                try {
                                                    await updateAdVisibility(promotingId, 'star');
                                                    showAlert(isChina ? "Ad updated to Premium Tier!" : "Ad changed to Star Premium!", "Success");
                                                    setIsPromoteModalOpen(false);
                                                    load();
                                                } catch (e: any) {
                                                    showAlert(e.message || "Failed to switch plan");
                                                }
                                            }}
                                        />
                                        {!isChina && (
                                            <PromotionTierCard 
                                                id="premium"
                                                title="Ultimate Tier"
                                                perk="Top Rank + VIP Manager"
                                                disabled={isLocked || !profile?.premium_plan_expires_at || new Date(profile.premium_plan_expires_at || 0) < new Date()}
                                                isActive={adPlan === 'premium'}
                                                slots={`${profile?.subscription_stats?.premium || 0} / ${profile?.subscription_stats?.limits?.premium || 50}`}
                                                onSelect={async () => {
                                                    if (!promotingId) return;
                                                    try {
                                                        await updateAdVisibility(promotingId, 'premium');
                                                        showAlert("Ad switched to Ultimate Visibility!", "Success");
                                                        setIsPromoteModalOpen(false);
                                                        load();
                                                    } catch (e: any) {
                                                        showAlert(e.message || "Failed to switch plan");
                                                    }
                                                }}
                                            />
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Plan Status Help */}
                        {(!profile?.basic_plan_expires_at || new Date(profile.basic_plan_expires_at) < new Date()) && (!profile?.star_plan_expires_at || new Date(profile.star_plan_expires_at) < new Date()) && (
                            <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Star className="text-orange-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-orange-900">Subscription Required</p>
                                    <p className="text-xs font-bold text-orange-700">You need a valid {isChina ? "Featured or Premium Tier" : "Featured or Premium"} subscription to unlock these slots.</p>
                                </div>
                                <Link href="/pricing" className="ml-auto bg-black text-white px-5 py-2 rounded-xl text-xs font-black">Get Plan</Link>
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

function PromotionTierCard({ title, perk, disabled, slots, onSelect, id, isActive }: { title: string, perk: string, disabled: boolean, slots: string, onSelect: () => void, id: string, isActive?: boolean }) {
    return (
        <div className={`p-6 rounded-[24px] border-2 flex flex-col items-start gap-4 transition-all ${
            isActive ? 'border-orange-500 bg-orange-50/50 ring-4 ring-orange-100' :
            disabled ? 'border-zinc-100 opacity-50 bg-zinc-50' : 'border-zinc-200 hover:border-orange-500 hover:bg-orange-50/30'
        }`}>
            <div className={`p-3 rounded-2xl ${id === 'star' ? 'bg-yellow-100 text-yellow-600' : 'bg-orange-100 text-orange-600'}`}>
                {id === 'star' ? <Star size={24} /> : <Zap size={24} />}
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-black text-black">{title}</h4>
                    {isActive && (
                        <span className="bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Current</span>
                    )}
                </div>
                <p className="text-zinc-500 font-bold text-xs">{perk}</p>
            </div>
            {!disabled && !isActive ? (
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
                        Select Plan
                    </button>
                </>
            ) : isActive ? (
                <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-orange-600 uppercase tracking-wider">
                    <CheckCircle size={12} />
                    Already Active
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                    <Lock size={12} />
                    {disabled && !isActive ? "Unavailable" : "Subscription Required"}
                </div>
            )}
        </div>
    );
}




