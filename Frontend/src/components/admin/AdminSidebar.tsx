"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Tag,
  BarChart3,
  Trash2,
  FileText,
  Settings,
  LogOut,
  Package,
  User,
  Store
} from "lucide-react";
import { getMyProfile } from "@/lib/api";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "submissions", label: "Submissions", icon: FileText, href: "/admin/submissions" },
  { id: "deals", label: "Deals Management", icon: Package, href: "/admin/deals" },
  { id: "vendors", label: "Vendors Management", icon: Store, href: "/admin/vendors" },
  { id: "taxonomy", label: "Taxonomy", icon: Tag, href: "/admin/taxonomy" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "deleted-deals", label: "Deleted Deals", icon: Trash2, href: "/admin/deleted-deals" },
  { id: "audit-logs", label: "Audit Logs", icon: FileText, href: "/admin/audit-logs" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        if (res?.data) {
          setUserName(res.data.name || "Admin User");
          setUserEmail(res.data.email || "");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
      });
  }, []);

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="w-full flex flex-col h-full bg-white border-r border-zinc-200">
      {/* Logo Section */}
      <div className="p-6 mb-4">
        <Link href="/">
          <Image
            src="/234dealslogo.svg"
            alt="234 Deals"
            width={120}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#f45c03] text-white shadow-md shadow-[#f45c03]/20"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-zinc-500"} />
              <span className="font-bold text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info Section */}
      <div className="mt-auto border-t border-zinc-100 p-4">
        <div className="flex items-center gap-3 mb-4 p-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center">
            <User size={20} className="text-zinc-400" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-[14px] text-zinc-900 truncate">{userName}</span>
            {userEmail && (
              <span className="text-[12px] text-zinc-500 truncate">{userEmail}</span>
            )}
          </div>
        </div>
        
        <button 
          className="flex items-center gap-3 w-full px-4 py-3 text-zinc-600 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors font-bold text-[15px]"
          onClick={handleSignOut}
        >
          <LogOut size={20} className="text-zinc-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}


