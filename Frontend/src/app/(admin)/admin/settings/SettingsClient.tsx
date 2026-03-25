"use client";

import React from "react";
import { Download, Bell } from "lucide-react";
import ProfileForm from "@/components/admin/settings/ProfileForm";
import ChangeEmailForm from "@/components/admin/settings/ChangeEmailForm";
import ChangePhoneForm from "@/components/admin/settings/ChangePhoneForm";
import ChangePasswordForm from "@/components/admin/settings/ChangePasswordForm";
import DeleteAccountSection from "@/components/admin/settings/DeleteAccountSection";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E85A28] text-[#E85A28] rounded-lg bg-white hover:bg-orange-50 transition-colors text-sm font-bold shadow-sm active:scale-95">
            <Download size={16} />
            Export
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Account Information Section */}
      <ProfileForm />

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8 font-bold">
        <h2 className="text-lg text-zinc-900 mb-2">Security</h2>
        <p className="text-sm text-zinc-500 mb-8 font-medium">Manage your security settings and verification</p>

        <div className="space-y-4">
          <ChangeEmailForm />
          <ChangePhoneForm />
          <ChangePasswordForm />
        </div>
      </div>

      {/* Delete Account Section */}
      <DeleteAccountSection />
    </div>
  );
}
