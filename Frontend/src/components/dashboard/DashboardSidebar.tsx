"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    PlusSquare,
    BarChart2,
    MessageSquare,
    Settings,
    ChevronDown,
    ShoppingCart
} from "lucide-react";
import { useEffect, useState } from "react";
import { listThreads } from "@/services/messages.service";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
    hasSubmenu?: boolean;
    badge?: number;
};

const baseItems: MenuItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/vendor-dashboard" },
    { id: "my-ads", label: "My Ads", icon: Package, href: "/vendor-dashboard/my-ads" },
    { id: "add-product", label: "Add Product", icon: PlusSquare, href: "/vendor-dashboard/add-product" },
    { id: "sales-stats", label: "Sales Stats", icon: BarChart2, href: "/vendor-dashboard/analytics" },
    { id: "subscription", label: "Subscription Plans", icon: ShoppingCart, href: "/pricing" },
    { id: "stats", label: "Stats & Subscription", icon: BarChart2, href: "/vendor-dashboard/subscription" },
    { id: "messages", label: "Messages", icon: MessageSquare, href: "/vendor-dashboard/messages" },
    { id: "settings", label: "Settings", icon: Settings, href: "/vendor-dashboard/settings/personal-details", hasSubmenu: true },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [unread, setUnread] = useState<number>(0);
    useEffect(() => {
        (async () => {
            try {
                const res = await listThreads();
                const total = (res.data || []).reduce((sum, t: any) => sum + (t.unread_count || 0), 0);
                setUnread(total);
            } catch {}
        })();
    }, []);
    const isUserDashboard = pathname.startsWith("/user-dashboard");
    
    // Filter items based on dashboard type
    const filteredBaseItems = baseItems.filter(item => {
        if (isUserDashboard) {
            // Buyers only see these
            return ["overview", "messages", "settings"].includes(item.id);
        }
        // Vendors see everything
        return true;
    });

    const menuItems: MenuItem[] = filteredBaseItems.map(it => {
        return it.id === "messages" ? { ...it, badge: unread || undefined } : it;
    });

    const settingsSubmenu = [
        { label: "Personal details", href: "/vendor-dashboard/settings/personal-details" },
        { label: "Verification", href: "/vendor-dashboard/settings/verification" },
        { label: "Change phone number", href: "/vendor-dashboard/settings/change-phone-number" },
        { label: "Change password", href: "/vendor-dashboard/settings/change-password" },
    ];

    return (
        <div className="w-full bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-zinc-200 p-2 py-4">
            <ul className="space-y-1">
                {menuItems.map((item) => {
                    const isUserDashboard = pathname.startsWith("/user-dashboard");
                    const itemHref = isUserDashboard ? item.href.replace("/vendor-dashboard", "/user-dashboard") : item.href;
                    const isActive = pathname === itemHref || (item.id === "settings" && pathname.startsWith(isUserDashboard ? "/user-dashboard/settings" : "/vendor-dashboard/settings"));

                    return (
                        <li key={item.id}>
                            <Link
                                href={itemHref}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 ${isActive
                                    ? "bg-[#708238] text-white"
                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className={isActive ? "text-white" : "text-zinc-500"} />
                                    <span className="font-bold text-[15px]">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.badge && (
                                        <span className="flex items-center justify-center w-5 h-5 rounded bg-[#708238] text-white text-[10px] font-bold border border-white">
                                            {item.badge}
                                        </span>
                                    )}
                                    {item.hasSubmenu && (
                                        <ChevronDown size={16} className={isActive ? "text-white" : "text-zinc-400"} />
                                    )}
                                </div>
                            </Link>

                            {/* Submenu for Settings (Conditional rendering based on design 4, 10-13) */}
                            {item.id === "settings" && pathname.startsWith("/vendor-dashboard/settings") && (
                                <ul className="mt-2 ml-4 space-y-1 border-l-2 border-zinc-100 pl-4">
                                    {settingsSubmenu.map((subItem) => (
                                        <li key={subItem.href}>
                                            <Link
                                                href={subItem.href}
                                                className={`block py-2 text-[14px] font-bold transition-colors ${pathname === subItem.href
                                                    ? "text-[#708238]"
                                                    : "text-zinc-500 hover:text-black"
                                                    }`}
                                            >
                                                {subItem.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}



