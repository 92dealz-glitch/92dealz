"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Wallet, 
  Target, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";
import Image from "next/image";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/user/dashboard" },
  { icon: Users, label: "My Team", href: "/user/dashboard/team" },
  { icon: Store, label: "Vendors", href: "/user/dashboard/vendors" },
  { icon: Wallet, label: "Commission", href: "/user/dashboard/commission" },
  { icon: Target, label: "Daily Performance", href: "/user/dashboard/performance" },
  { icon: FileText, label: "Report", href: "/user/dashboard/report" },
  { icon: Settings, label: "Settings", href: "/user/dashboard/settings" },
];

export default function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-zinc-200 flex flex-col h-[calc(100vh-80px)] sticky top-20 hidden lg:flex">
      <div className="flex-1 py-8 px-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${
                isActive 
                  ? "bg-[#F05023] text-white" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-white" : "text-zinc-400"} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Card */}
      <div className="p-4 border-t border-zinc-100">
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#F05023] text-white flex items-center justify-center font-bold">
              AU
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-zinc-900 truncate">Admin User</span>
              <span className="text-[11px] text-zinc-500 truncate font-medium">admin@234deal.com</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
