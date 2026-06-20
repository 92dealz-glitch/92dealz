"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import {
    Package,
    Eye,
    TrendingUp,
    MessageSquare,
    Star,
    Zap,
    ArrowUpCircle,
    CheckCircle2
} from "lucide-react";
import { getProfile } from "@/services/user.service";
import { getVendorStats } from "@/services/vendor.service";
import { listMyAds } from "@/services/ads.service";
import { UserProfile } from "@/lib/api";

export default function VendorDashboardPage() {
    const [stats, setStats] = useState<{ads:number; views:number; sold:number; msgs:number; unread:number}>({ads:0, views:0, sold:0, msgs:0, unread:0});
    const [recentAds, setRecentAds] = useState<any[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getVendorStats();
                const d = res.data;
                setStats({ ads: d.total_ads, views: d.total_views, sold: d.items_sold, msgs: d.messages_total, unread: d.messages_unread });
                
                const adsRes = await listMyAds();
                if (adsRes.success) {
                    setRecentAds(adsRes.data.slice(0, 5));
                }

                const profileRes = await getProfile();
                if (profileRes.success) {
                    setProfile(profileRes.data);
                }
            } catch {} finally {
                setLoading(false);
            }
        })();
    }, []);

    const phone = profile?.phone || "";
    const isChina = profile?.country_name === 'China' || profile?.country_code === 'CN' || phone.startsWith('+86') || phone.startsWith('86');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#708238] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 lg:mb-12">
                <h1 className="text-[#708238] text-3xl sm:text-4xl lg:text-5xl font-black mb-2">
                    Vendor Dashboard
                </h1>
                <p className="text-zinc-600 font-semibold text-sm lg:text-base">
                    Manage your listings and track performance
                </p>
            </div>

            {/* Subscription Overview */}
            {profile && (
                <div className="mb-10 p-1 bg-gradient-to-r from-orange-500 via-[#708238] to-[#312E81] rounded-[32px] shadow-lg shadow-[#E9E0D4]">
                    <div className="bg-white rounded-[31px] p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-[24px] ${profile.subscription_plan === 'star' ? 'bg-yellow-100 text-yellow-600' : profile.subscription_plan === 'basic' ? 'bg-[#E9E0D4] text-[#708238]' : 'bg-gray-100 text-gray-500'}`}>
                                    {profile.subscription_plan === 'star' ? <Star size={32} /> : <Zap size={32} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-black text-black">
                                            {isChina 
                                              ? (profile.subscription_plan === 'star' ? 'Premium Tier' : profile.subscription_plan === 'basic' ? 'Featured Tier' : 'No Active Plan')
                                              : (profile.subscription_plan ? profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1) : 'Free') + ' Plan'
                                            }
                                        </h2>
                                        {(profile.subscription_plan && profile.subscription_plan !== 'free') && (
                                            <span className="bg-[#FFFDF9] text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Active</span>
                                        )}
                                    </div>
                                    <p className="text-zinc-500 font-bold text-sm">
                                        {profile.subscription_plan === 'star' 
                                          ? (isChina ? '20 Premium Market Slots' : '20 Featured & Top Ranking Ads') 
                                          : profile.subscription_plan === 'basic' 
                                            ? (isChina ? '10 Featured Market Slots' : '10 Featured Ads') 
                                            : (isChina ? 'Purchase a plan to start listing' : '1 Free Ad per month')}
                                    </p>
                                    {profile.basic_plan_expires_at && (
                                        <p className="text-[11px] text-zinc-400 mt-2 font-bold uppercase tracking-wider">Basic Expires: {new Date(profile.basic_plan_expires_at).toLocaleDateString()}</p>
                                    )}
                                    {profile.star_plan_expires_at && (
                                        <p className="text-[11px] text-zinc-400 mt-1 font-bold uppercase tracking-wider">Star Expires: {new Date(profile.star_plan_expires_at).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>

                            <div className={`flex-1 grid grid-cols-1 ${isChina ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-6 max-w-3xl`}>
                                {!isChina && (
                                    <UsageMeter 
                                        label="Standard (Free)" 
                                        current={profile.subscription_stats?.free || 0} 
                                        limit={profile.subscription_stats?.limits?.free || 1} 
                                        color="bg-zinc-500"
                                    />
                                )}
                                <UsageMeter 
                                    label={isChina ? "Featured Tier" : "Featured (Basic)"} 
                                    current={profile.subscription_stats?.basic || 0} 
                                    limit={profile.subscription_stats?.limits?.basic || 10} 
                                    color="bg-[#708238]"
                                />
                                <UsageMeter 
                                    label={isChina ? "Premium Tier" : "Top Ads (Star)"} 
                                    current={profile.subscription_stats?.star || 0} 
                                    limit={profile.subscription_stats?.limits?.star || 20} 
                                    color="bg-yellow-500"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => window.location.href = '/pricing'}
                                    className="px-8 py-3 bg-black text-white font-black rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                                >
                                    <ArrowUpCircle size={18} />
                                    Upgrade Plan
                                </button>
                                <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Boost your reach</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    label="Total Ads"
                    value={stats.ads}
                    subtext="this month"
                    
                    icon={Package}
                />
                <StatsCard
                    label="Total Views"
                    value={stats.views}
                    subtext="this month"
                   
                    icon={Eye}
                />
                <StatsCard
                    label="Items Sold"
                    value={stats.sold}
                    subtext="this month"
                   
                    icon={TrendingUp}
                />
                <StatsCard
                    label="Messages"
                    value={stats.msgs}
                    subtext={`${stats.unread} unread`}
                    subtextColor="text-zinc-500"
                    
                    icon={MessageSquare}
                />
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <RecentActivity ads={recentAds} />
        </>
    );
}

function UsageMeter({ label, current, limit, color }: { label: string, current: number, limit: number, color: string }) {
    const percent = Math.min((current / limit) * 100, 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-black text-black">{current} / {limit}</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}



