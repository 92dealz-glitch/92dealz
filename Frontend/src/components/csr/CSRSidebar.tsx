"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, FileCheck, Flag, Package } from 'lucide-react';

export default function CSRSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Vendor Management", icon: Users, path: "/csr-dashboard?tab=vendors" },
    { label: "Deal Management", icon: Package, path: "/csr-dashboard?tab=deals" },
    { label: "Verification Requests", icon: FileCheck, path: "/csr-dashboard?tab=verifications" },
    { label: "Reports & Appeals", icon: Flag, path: "/csr-dashboard?tab=reports" },
  ];

  return (
    <div className="flex flex-col h-full bg-white min-h-[800px] border-r border-zinc-100">
      <div className="p-6 border-b border-zinc-100 bg-[#E9E0D4]/30">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight uppercase">CSR <span className="text-[#708238]">Portal</span></h2>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Customer Service Team</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? "bg-[#708238] text-white shadow-md shadow-[#C7A27C]" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-[#708238]"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-zinc-400"} />
              <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


