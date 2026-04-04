"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { changePassword } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

export default function ChangePasswordPage() {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShow = (key: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            showNotification("error", "New passwords do not match!");
            return;
        }

        if (formData.newPassword.length < 6) {
            showNotification("error", "New password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (res.success) {
                showNotification("success", "Password updated successfully!");
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                showNotification("error", res.message || "Failed to update password");
            }
        } catch (err: any) {
            showNotification("error", err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-100 overflow-hidden p-8 lg:p-14 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck size={120} className="text-zinc-900" />
            </div>

            <h2 className="text-zinc-900 font-black text-3xl mb-2 uppercase tracking-tighter italic">Security Access</h2>
            <p className="text-zinc-500 font-bold text-sm mb-12">Update your authentication credentials to maintain account integrity.</p>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <PasswordField 
                    label="Current security key" 
                    name="currentPassword"
                    placeholder="Enter current password" 
                    value={formData.currentPassword}
                    onChange={handleChange}
                    show={showPasswords.current}
                    onToggle={() => toggleShow('current')}
                />
                
                <div className="h-px bg-zinc-100 w-full" />

                <PasswordField 
                    label="New security key" 
                    name="newPassword"
                    placeholder="Create a strong password" 
                    value={formData.newPassword}
                    onChange={handleChange}
                    show={showPasswords.new}
                    onToggle={() => toggleShow('new')}
                    hint="Minimum 6 characters recommended."
                />

                <PasswordField 
                    label="Confirm new key" 
                    name="confirmPassword"
                    placeholder="Repeat new password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    show={showPasswords.confirm}
                    onToggle={() => toggleShow('confirm')}
                />

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={loading || !formData.currentPassword || !formData.newPassword}
                        className="w-full sm:w-auto bg-[#f45c03] hover:bg-orange-600 text-white font-black py-4 px-16 rounded-2xl transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Credentials"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function PasswordField({ 
    label, 
    name, 
    placeholder, 
    value, 
    onChange, 
    show, 
    onToggle,
    hint 
}: { 
    label: string, 
    name: string, 
    placeholder: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    show: boolean,
    onToggle: () => void,
    hint?: string
}) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-end px-1">
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">{label}</label>
                {hint && <span className="text-[10px] font-bold text-zinc-400 italic">{hint}</span>}
            </div>
            <div className="relative group">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    placeholder={placeholder}
                    className="w-full border-2 border-zinc-100 rounded-2xl p-4 text-zinc-900 font-black text-sm focus:outline-none focus:border-[#f45c03] transition-all bg-zinc-50 group-hover:bg-white placeholder:text-zinc-300"
                />
                <button 
                    type="button" 
                    onClick={onToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition-colors p-2"
                >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    )
}
