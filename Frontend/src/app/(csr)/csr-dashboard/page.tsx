"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VendorManagement from '@/components/admin/VendorManagement';
import VendorVerificationRequests from '@/components/admin/VendorVerificationRequests';
import AdminReportManagement from '@/components/admin/AdminReportManagement';
import CSRDealManagement from '@/components/csr/CSRDealManagement';
import { Users, ShieldCheck, Flag, Package, Loader2, LogOut } from 'lucide-react';

function CSRDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('vendors');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['vendors', 'verifications', 'reports', 'deals'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'deals', label: 'Deals', icon: Package },
    { id: 'verifications', label: 'Verify', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: Flag },
  ];

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      const { deleteCookie } = require('@/lib/cookies');
      deleteCookie("token");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("user_id");
      window.localStorage.removeItem("user");
    }
    // next-auth signOut if applicable
    try {
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
    } catch (e) {}
    
    // Redirect to the custom CSR login path
    window.location.href = process.env.NEXT_PUBLIC_CSR_LOGIN_PATH || "/843901globallink-92dealz-cr-485n9485n02";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-row items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight text-orange-900">Workspace</h1>
          <p className="text-zinc-500 text-sm font-medium italic mt-1">Monitor, verify, and resolve issues</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-black uppercase text-[10px] tracking-widest shadow-sm border border-red-100"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* Tabs Navigation - HIDDEN ON DESKTOP (Sidebar used instead) */}
      <div className="flex md:hidden flex-wrap items-center gap-2 border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-[#708238] text-[#708238] bg-[#E9E0D4]/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2 lg:mt-6">
        {activeTab === 'vendors' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-4 px-2">
                <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Merchant Directory</h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
              </div>
            <VendorManagement />
          </section>
        )}

        {activeTab === 'deals' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4 px-2">
              <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Deal Moderation</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
            </div>
            <CSRDealManagement />
          </section>
        )}

        {activeTab === 'verifications' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4 px-2">
              <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">ID Verification</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
            </div>
            <VendorVerificationRequests />
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4 px-2">
              <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Moderation Box</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
            </div>
            <AdminReportManagement />
          </section>
        )}
      </div>

      <div className="bg-[#E9E0D4]/50 p-6 rounded-2xl border border-[#E9E0D4]/30/50 flex flex-col sm:flex-row items-center gap-6 justify-between mt-10">
         <div className="flex-1">
             <h3 className="font-black text-orange-900 uppercase tracking-widest text-sm mb-1">Moderator Accountability</h3>
             <p className="text-sm font-medium text-[#5E6E2F]/70">All actions are logged. Ensure you review all reports and IDs thoroughly before deciding.</p>
         </div>
      </div>
    </div>
  );
}

export default function CSRDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-[#708238]">
        <Loader2 className="animate-spin" size={40} />
        <span className="font-black uppercase tracking-widest text-xs">Loading Workspace...</span>
      </div>
    }>
      <CSRDashboardContent />
    </Suspense>
  );
}


