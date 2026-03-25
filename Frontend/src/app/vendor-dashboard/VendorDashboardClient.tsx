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
    MessageSquare
} from "lucide-react";
import { getVendorStats } from "@/services/vendor.service";
import { listMyAds } from "@/services/ads.service";

export default function VendorDashboardPage() {
    const [stats, setStats] = useState<{ads:number; views:number; sold:number; msgs:number; unread:number}>({ads:0, views:0, sold:0, msgs:0, unread:0});
    const [recentAds, setRecentAds] = useState<any[]>([]);

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
            } catch {}
        })();
    }, []);
    return (
        <>
            <div className="mb-8 lg:mb-12">
                <h1 className="text-[#FF6B35] text-3xl sm:text-4xl lg:text-5xl font-black mb-2">
                    Vendor Dashboard
                </h1>
                <p className="text-zinc-600 font-semibold text-sm lg:text-base">
                    Manage your listings and track performance
                </p>
            </div>

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
