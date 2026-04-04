"use client";
import React, { useEffect, useState } from "react";
import { Upload, Plus, CheckCircle2, Clock, AlertCircle, Loader2, Phone, ShieldCheck, ArrowRight, X } from "lucide-react";
import { getMyProfile, requestVerification, sendVerificationOtp, verifyContactOtp } from "@/lib/api";
import { uploadImage } from "@/services/upload.service";
import { useNotification } from "@/context/NotificationContext";

export default function VerificationPage() {
    const { showNotification } = useNotification();
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // OTP States
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await getMyProfile();
            if (res?.data) {
                setStatus(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url } = await uploadImage(file);
            await requestVerification(url);
            showNotification("success", "ID uploaded and verification request submitted!");
            fetchStatus();
        } catch (err: any) {
            showNotification("error", err.message || "Failed to submit verification");
        } finally {
            setUploading(false);
        }
    };

    const handleSendPhoneOtp = async () => {
        if (!status?.phone) {
            showNotification("error", "No phone number found in profile. Please update it in settings first.");
            return;
        }
        setSendingOtp(true);
        try {
            const res = await sendVerificationOtp({ contact: status.phone, method: "phone" });
            if (res.success) {
                setShowOtpInput(true);
                showNotification("success", "Verification code sent to your phone!");
            }
        } catch (err: any) {
            showNotification("error", err.message || "Failed to send OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            showNotification("error", "Please enter a valid code");
            return;
        }
        setVerifyingOtp(true);
        try {
            const res = await verifyContactOtp({ contact: status.phone, method: "phone", otp });
            if (res.success) {
                showNotification("success", "Phone number verified successfully!");
                setShowOtpInput(false);
                fetchStatus(); // Refresh profile
            }
        } catch (err: any) {
            showNotification("error", err.message || "Verification failed");
        } finally {
            setVerifyingOtp(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;

    const vStatus = status?.verification_status || 'none';
    const isVerified = status?.is_verified;
    const isPhoneVerified = status?.is_phone_verified;
    const isEmailVerified = status?.is_email_verified;

    return (
        <div className="animate-in fade-in duration-700 space-y-12 pb-20">
            {/* Account Verification Section */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8">
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg ${
                        isVerified ? 'bg-emerald-500 shadow-emerald-100' : 
                        vStatus === 'pending' ? 'bg-amber-500 shadow-amber-100' : 
                        vStatus === 'rejected' ? 'bg-red-500 shadow-red-100' : 'bg-zinc-500 shadow-zinc-100'
                    }`}>
                        {isVerified ? 'Trusted Seller' : vStatus === 'none' ? 'Unverified' : vStatus.charAt(0).toUpperCase() + vStatus.slice(1)}
                    </div>
                </div>

                <div className="p-8 lg:p-14">
                    <h2 className="text-zinc-900 font-bold text-2xl mb-3 tracking-tight">Identity Verification</h2>
                    <p className="text-zinc-500 text-sm mb-12 max-w-xl">Build trust within the marketplace by providing a valid government-issued identifier.</p>

                    <div className="max-w-3xl space-y-10">
                        {vStatus === 'none' || vStatus === 'rejected' ? (
                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                    <div className="space-y-4">
                                        <label className="text-zinc-900 font-bold text-xs pl-1">Select Identity Type</label>
                                        <div className="relative group">
                                            <select className="appearance-none w-full border-2 border-zinc-100 rounded-2xl p-5 text-zinc-900 font-black text-sm focus:outline-none focus:border-[#f45c03] transition-all bg-zinc-50 group-hover:bg-white">
                                                <option>NIN (Slip or Card)</option>
                                                <option>International Passport</option>
                                                <option>Driver&apos;s License</option>
                                                <option>Voter&apos;s Card</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                <ChevronDownIcon />
                                            </div>
                                        </div>
                                    </div>

                                    <label className="aspect-[1.8/1] rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#f45c03] hover:bg-orange-50 transition-all text-zinc-300 hover:text-[#f45c03] group relative overflow-hidden bg-zinc-50/50">
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin text-orange-600" size={40} />
                                                <span className="text-[10px] font-bold text-orange-600 animate-pulse">Scanning Document...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                     <Plus size={32} className="text-zinc-400 group-hover:text-[#f45c03]" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Front View</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                                    </label>
                                </div>
                                {vStatus === 'rejected' && (
                                    <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 animate-in shake-in duration-300">
                                        <AlertCircle size={20} />
                                        <span className="text-xs font-black uppercase tracking-tight">Your previous verification was rejected. Please upload a clearer document.</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-zinc-900 p-10 rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                                {isVerified ? (
                                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-emerald-500/20 rotate-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-amber-500 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-amber-500/20 animate-pulse">
                                        <Clock size={40} />
                                    </div>
                                )}
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-white font-bold text-xl tracking-tight">
                                        {isVerified ? "Identity Secured" : "Pending Review"}
                                    </h4>
                                    <p className="text-zinc-400 font-bold text-sm mt-2 leading-relaxed opacity-80">
                                        {isVerified 
                                            ? "Expert level trust unlocked. Your listings will now feature the verified merchant badge globally."
                                            : "Our security team is manually authenticating your credentials. This typically concludes within 24 business hours."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Phone Verification Section */}
                <div className="bg-white rounded-3xl border border-zinc-200 p-8 lg:p-12 shadow-xl shadow-zinc-100/50 flex flex-col justify-between group">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-orange-100 text-[#f45c03] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                <Phone size={24} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                isPhoneVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {isPhoneVerified ? 'FULLY SECURED' : 'UNVERIFIED'}
                            </span>
                        </div>
                        <h2 className="text-zinc-900 font-bold text-2xl mb-2 tracking-tight">Commercial Contact</h2>
                        <p className="text-zinc-500 text-xs mb-10 opacity-80">Direct verification ensures buyers can reach you reliably for transactions.</p>

                        {!showOtpInput ? (
                            <div className="space-y-6">
                                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
                                    <p className="text-[10px] font-bold text-zinc-400 mb-1 pl-1">Registered Number</p>
                                    <p className="text-zinc-900 font-bold text-lg tracking-wider">{status?.phone || "+234 XXX XXX XXXX"}</p>
                                </div>

                                {isPhoneVerified ? (
                                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                                        <ShieldCheck size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Phone verified successfully</span>
                                    </div>
                                ) : (
                                    <button 
                                        disabled={sendingOtp || !status?.phone}
                                        onClick={handleSendPhoneOtp}
                                        className="w-full bg-[#f45c03] text-white py-4 rounded-2xl font-bold text-xs hover:bg-[#f45c03] shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {sendingOtp ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                                        Verify This Number
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in zoom-in-95 duration-200">
                                <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 relative">
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 pl-1">Enter 6-Digit Code</p>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full bg-transparent border-none outline-none text-2xl font-black tracking-[1em] text-center text-[#f45c03] placeholder:text-orange-200"
                                    />
                                    <button onClick={() => setShowOtpInput(false)} className="absolute top-2 right-2 p-1 text-orange-300 hover:text-orange-600 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <button 
                                    disabled={verifyingOtp || otp.length < 4}
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {verifyingOtp ? <Loader2 className="animate-spin" size={16} /> : "Finalize Verification"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Verification Section */}
                <div className="bg-white rounded-3xl border border-zinc-200 p-8 lg:p-12 shadow-xl shadow-zinc-100/50 flex flex-col justify-between opacity-80 border-dashed">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm shadow-emerald-50">
                                {isEmailVerified ? 'LOCKED & VERIFIED' : 'PENDING'}
                            </span>
                        </div>
                        <h2 className="text-zinc-900 font-black text-2xl mb-2 uppercase tracking-tight italic">Email Authenticity</h2>
                        <p className="text-zinc-500 font-bold text-xs mb-10 italic">Core authentication channel for password resets and security alerts.</p>

                        <div className="space-y-6">
                            <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 pl-1">Authorized Email</p>
                                <p className="text-zinc-900 font-bold text-sm tracking-tight truncate">{status?.email || "example@domain.com"}</p>
                            </div>

                            <button className="w-full bg-zinc-100 text-zinc-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] cursor-not-allowed border border-zinc-200/50 italic">
                                Automatically Verified On Startup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronDownIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
