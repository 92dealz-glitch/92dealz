"use client";
import React from 'react';
import VendorManagement from '@/components/admin/VendorManagement';
import VendorVerificationRequests from '@/components/admin/VendorVerificationRequests';

export default function CSRDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight text-orange-900">Workspace</h1>
          <p className="text-zinc-500 text-sm font-medium italic mt-1">Monitor, verify, and assist vendors on the platform</p>
        </div>
      </div>

      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50 flex flex-col sm:flex-row items-center gap-6 justify-between">
         <div className="flex-1">
             <h3 className="font-black text-orange-900 uppercase tracking-widest text-sm mb-1">Active Session Logged</h3>
             <p className="text-sm font-medium text-orange-700/70">Your time is being logged for payroll automatically. Ensure you handle vendor requests promptly.</p>
         </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-2 px-2">
            <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Verification Requests</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
          </div>
          <VendorVerificationRequests />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-2 px-2">
            <h2 className="text-lg font-black uppercase tracking-tight text-zinc-800">Vendor Management Portal</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-zinc-200 to-transparent"></div>
          </div>
          <VendorManagement />
        </section>
      </div>
    </div>
  );
}
