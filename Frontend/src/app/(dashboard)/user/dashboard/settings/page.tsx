"use client";

import React from "react";
import { Download, Bell } from "lucide-react";
import ProfileForm from "@/components/admin/settings/ProfileForm";
import ChangeEmailForm from "@/components/admin/settings/ChangeEmailForm";
import ChangePhoneForm from "@/components/admin/settings/ChangePhoneForm";
import ChangePasswordForm from "@/components/admin/settings/ChangePasswordForm";
import DeleteAccountSection from "@/components/admin/settings/DeleteAccountSection";

export default function UserSettingsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Account Settings</h1>
          <p className="text-zinc-500 font-medium">Manage your profile information and security</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 border border-zinc-200 bg-white text-zinc-900 font-bold py-3.5 px-8 rounded-xl hover:bg-zinc-50 transition-all shadow-sm">
            <Download size={20} className="text-[#F05023]" />
            Export Data
          </button>
          <div className="w-12 h-12 rounded-xl border border-zinc-200 flex items-center justify-center relative bg-white shadow-sm font-bold text-zinc-400">
             🔔
             <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F05023] rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <ProfileForm />
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8 font-bold">
        <h2 className="text-xl text-zinc-900 mb-2">Security & Privacy</h2>
        <p className="text-sm text-zinc-500 mb-10 font-medium">Manage your security settings and account verification</p>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50">
            <ChangeEmailForm />
          </div>
          <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50">
            <ChangePhoneForm />
          </div>
          <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50">
            <ChangePasswordForm />
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <DeleteAccountSection />
      </div>
    </div>
  );
}
