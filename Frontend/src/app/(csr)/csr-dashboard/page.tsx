"use client";
import React, { useState, useEffect } from 'react';
import VendorManagement from '@/components/admin/VendorManagement';
import VendorVerificationRequests from '@/components/admin/VendorVerificationRequests';
import AdminReportManagement from '@/components/admin/AdminReportManagement';
import { Users, ShieldCheck, Flag } from 'lucide-react';

export default function CSRDashboardPage() {
  const [activeTab, setActiveTab] = useState('vendors');

  useEffect(() => {
    // Check if there's a tab preference in URL or LocalStorage
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['vendors', 'verifications', 'reports'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const tabs = [
    { id: 'vendors', label: 'Vendor Management', icon: Users },
    { id: 'verifications', label: 'Verification Requests', icon: ShieldCheck },
    { id: 'reports', label: 'Reports & Appeals', icon: Flag },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight text-orange-900">Workspace</h1>
          <p className="text-zinc-500 text-sm font-medium italic mt-1">Monitor, verify, and resolve issues on the platform</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-orange-600 text-orange-600 bg-orange-50/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'vendors' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-2 px-2">
                <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Vendor Management Portal</h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
              </div>
            <VendorManagement />
          </section>
        )}

        {activeTab === 'verifications' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2 px-2">
              <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Verification Box</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
            </div>
            <VendorVerificationRequests />
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2 px-2">
              <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Reports & Content Appeals</h2>
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
