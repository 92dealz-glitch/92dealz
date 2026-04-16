"use client";

import React, { useEffect, useState } from "react";
import { getProfile } from "@/services/user.service";
import { UserProfile } from "@/lib/api";
import { 
    Zap, Star, Trophy, Package, CheckCircle, Clock, 
    ArrowUpCircle, Info, ShieldCheck, ChevronRight 
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionStatsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProfile();
                if (res.success) setProfile(res.data);
            } catch (err) {} finally {
                setLoading(null as any);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="p-8 text-zinc-500 font-bold">Loading Stats...</div>;
    if (!profile) return <div className="p-8 text-red-500">Failed to load profile.</div>;

    const currentTier = profile.subscription_plan || 'free';
    const stats = profile.subscription_stats;
    const isChina = profile.country_code === 'CN' || profile.country_name === 'China';
    
    const getPlanName = () => {
        if (isChina) {
            if (currentTier === 'star') return 'Premium';
            if (currentTier === 'basic') return 'Featured';
            return currentTier.charAt(0).toUpperCase() + currentTier.slice(1);
        }
        if (currentTier === 'premium') return 'Ultimate';
        if (currentTier === 'star') return 'Star Premium';
        if (currentTier === 'basic') return 'Featured';
        return 'Standard';
    };

    const planName = getPlanName();

    const getPlanExpiry = () => {
        if (currentTier === 'premium') return profile.premium_plan_expires_at;
        if (currentTier === 'star') return profile.star_plan_expires_at;
        if (currentTier === 'basic') return profile.basic_plan_expires_at;
        return null;
    };

    const expiryDate = getPlanExpiry();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Banner */}
            <div className="bg-black rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest mb-6">
                        <ShieldCheck size={14} /> Active Subscription
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 capitalize">
                        {planName} <span className="text-[#f45c03]">Member</span>
                    </h1>
                    <p className="text-zinc-400 font-bold text-lg mb-8">
                        Your vendor account is active and optimized for high-conversion visibility.
                    </p>
                    
                    {expiryDate && (
                        <div className="flex items-center gap-3 text-sm font-bold bg-white/5 border border-white/10 w-fit px-6 py-3 rounded-2xl">
                            <Clock size={16} className="text-orange-500" />
                            <span>Plan Expires: <span className="text-white">{new Date(expiryDate).toLocaleDateString()}</span></span>
                        </div>
                    )}
                </div>
                {/* Abstract shape */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent skew-x-12 translate-x-1/4 pointer-events-none" />
            </div>

            {/* Inventory Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
                    <div>
                        <p className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-1">Active Listings</p>
                        <p className="text-4xl font-black text-black">{stats?.active_count || 0}</p>
                    </div>
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <CheckCircle size={32} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-colors">
                    <div>
                        <p className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-1">Pending / Inactive</p>
                        <p className="text-4xl font-black text-black">{stats?.inactive_count || 0}</p>
                    </div>
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Clock size={32} />
                    </div>
                </div>
            </div>

            {/* Detailed Slot Capacity */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-zinc-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-black">Plan Capacity</h2>
                    <Link href="/pricing" className="text-[#f45c03] font-black text-sm flex items-center gap-1 hover:underline">
                        Upgrade Tiers <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="space-y-10">
                    {/* Ultimate */}
                    {stats?.limits.premium && (
                        <CapacityBar 
                            label="Ultimate Visibility" 
                            used={stats.premium} 
                            limit={1000000} 
                            color="bg-purple-600" 
                            icon={<Trophy size={20} className="text-purple-600" />} 
                            isUnlimited={true}
                        />
                    )}
                    
                    {/* Star */}
                    <CapacityBar 
                        label="Star Premium" 
                        used={stats?.star || 0} 
                        limit={stats?.limits.star || 20} 
                        color="bg-yellow-500" 
                        icon={<Star size={20} className="text-yellow-600" />} 
                    />

                    {/* Basic/Featured */}
                    <CapacityBar 
                        label="Featured Boost" 
                        used={stats?.basic || 0} 
                        limit={stats?.limits.basic || 10} 
                        color="bg-[#f45c03]" 
                        icon={<Zap size={20} className="text-[#f45c03]" />} 
                    />

                    {/* Standard */}
                    <CapacityBar 
                        label="Standard Multiplier" 
                        used={stats?.free || 0} 
                        limit={stats?.limits.free || 1} 
                        color="bg-zinc-400" 
                        icon={<Package size={20} className="text-zinc-500" />} 
                    />
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 flex flex-col md:flex-row items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center shrink-0">
                    <ArrowUpCircle className="text-[#f45c03]" size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-zinc-900 font-black mb-1">Boost Your Visibility</p>
                    <p className="text-zinc-500 text-sm font-bold">Upgrading to a higher plan automatically promotes your existing products to the new visibility tier for immediate impact.</p>
                </div>
                <Link href="/pricing" className="bg-[#f45c03] text-white px-8 py-3 rounded-2xl font-black text-sm whitespace-nowrap shadow-lg shadow-orange-100 active:scale-95 transition-all">
                    View Pricing
                </Link>
            </div>
        </div>
    );
}

function CapacityBar({ label, used, limit, color, icon, isUnlimited = false }: any) {
    const percentage = isUnlimited ? 100 : Math.min(100, (used / limit) * 100);
    
    return (
        <div>
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">{icon}</div>
                    <span className="font-black text-black">{label}</span>
                </div>
                <div className="text-right">
                    <span className="text-lg font-black text-black">{isUnlimited ? used : `${used} / ${limit}`}</span>
                    <span className="text-[10px] block font-bold text-zinc-400 uppercase tracking-widest">Slots Used</span>
                </div>
            </div>
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 rounded-full ${color}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
