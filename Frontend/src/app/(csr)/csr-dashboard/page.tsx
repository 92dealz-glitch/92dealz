"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VendorManagement from '@/components/admin/VendorManagement';
import VendorVerificationRequests from '@/components/admin/VendorVerificationRequests';
import AdminReportManagement from '@/components/admin/AdminReportManagement';
import CSRDealManagement from '@/components/csr/CSRDealManagement';
import { Users, ShieldCheck, Flag, Package, Loader2 } from 'lucide-react';

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight text-orange-900">Workspace</h1>
          <p className="text-zinc-500 text-sm font-medium italic mt-1">Monitor, verify, and resolve issues on the platform</p>
        </div>
      </div>

      {/* Tabs Navigation - HIDDEN ON DESKTOP (Sidebar used instead) */}
      <div className="flex md:hidden flex-wrap items-center gap-2 border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-orange-600 text-orange-600 bg-orange-50/50'
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

      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50 flex flex-col sm:flex-row items-center gap-6 justify-between mt-10">
         <div className="flex-1">
             <h3 className="font-black text-orange-900 uppercase tracking-widest text-sm mb-1">Moderator Accountability</h3>
             <p className="text-sm font-medium text-orange-700/70">All actions are logged. Ensure you review all reports and IDs thoroughly before deciding.</p>
         </div>
      </div>
    </div>
  );
}

export default function CSRDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-orange-600">
        <Loader2 className="animate-spin" size={40} />
        <span className="font-black uppercase tracking-widest text-xs">Loading Workspace...</span>
      </div>
    }>
      <CSRDashboardContent />
    </Suspense>
  );
}
