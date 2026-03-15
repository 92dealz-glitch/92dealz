"use client";
import React from "react";
import { Eye } from "lucide-react";

export default function ChangePasswordPage() {
    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12 animate-in fade-in duration-500 max-w-2xl">
            <h2 className="text-black font-black text-2xl mb-1">Change Password</h2>
            <p className="text-zinc-500 font-bold text-sm mb-12">Create a new password to keep your account secure.</p>

            <form className="space-y-8">
                <PasswordField label="Current password" placeholder="Enter current password" />
                <PasswordField label="New password" placeholder="Enter new password" />
                <PasswordField label="Confirm new password" placeholder="Re-enter new password" />

                <button className="bg-[#E85A28] hover:bg-[#D44D1F] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]">
                    Update password
                </button>
            </form>
        </div>
    );
}

function PasswordField({ label, placeholder }: { label: string, placeholder: string }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-black font-black text-[15px]">{label}</label>
            <div className="relative">
                <input
                    type="password"
                    placeholder={placeholder}
                    className="w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors pr-12"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors">
                    <Eye size={20} />
                </button>
            </div>
        </div>
    )
}
