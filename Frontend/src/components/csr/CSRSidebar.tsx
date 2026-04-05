"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, FileCheck, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function CSRSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    await signOut({ redirect: false });
    router.push("/csr-login");
  };

  const navItems = [
    { label: "Vendor Management", icon: Users, path: "/csr-dashboard" },
  ];

  return (
    <div className="flex flex-col h-full bg-white h-full min-h-[800px] border-r border-zinc-100">
      <div className="p-6 border-b border-zinc-100 bg-blue-50/30">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight uppercase">CSR <span className="text-blue-600">Portal</span></h2>
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-blue-600"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-zinc-400 group-hover:text-blue-500"} />
              <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100 bg-zinc-50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 text-red-600 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
