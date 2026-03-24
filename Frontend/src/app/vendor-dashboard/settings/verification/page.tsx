import React, { useEffect, useState } from "react";
import { Upload, Plus, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { getMyProfile, requestVerification } from "@/lib/api";
import { uploadImage } from "@/services/upload.service";

export default function VerificationPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

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
        setMessage({ text: "", type: "" });
        try {
            const { url } = await uploadImage(file);
            await requestVerification(url);
            setMessage({ text: "ID uploaded and verification request submitted!", type: "success" });
            fetchStatus();
        } catch (err: any) {
            setMessage({ text: err.message || "Failed to submit verification", type: "error" });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;

    const vStatus = status?.verification_status || 'none';
    const isVerified = status?.is_verified;

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            {/* Account Verification */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-black font-black text-2xl">Account verification</h2>
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase text-white ${
                        isVerified ? 'bg-emerald-500' : 
                        vStatus === 'pending' ? 'bg-amber-500' : 
                        vStatus === 'rejected' ? 'bg-red-500' : 'bg-zinc-500'
                    }`}>
                        {isVerified ? 'Verified' : vStatus === 'none' ? 'Not verified' : vStatus}
                    </span>
                </div>
                <p className="text-zinc-500 font-bold text-sm mb-8">Help other users trust you by verifying your account.</p>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {message.text}
                    </div>
                )}

                <div className="max-w-2xl space-y-8">
                    {vStatus === 'none' || vStatus === 'rejected' ? (
                        <>
                            <div className="flex flex-col gap-4">
                                <label className="text-black font-black text-lg">Upload a valid government ID (NIN, Passport, Driver&apos;s License)</label>
                                <div className="relative">
                                    <select className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors bg-white">
                                        <option>NIN</option>
                                        <option>Passport</option>
                                        <option>Driver&apos;s License</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <ChevronDownIcon />
                                    </div>
                                </div>
                            </div>

                            <label className="aspect-[2/1] max-w-sm rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#E85A28] hover:bg-orange-50 transition-all text-zinc-400 hover:text-[#E85A28] group">
                                {uploading ? (
                                    <Loader2 className="animate-spin" size={32} />
                                ) : (
                                    <>
                                        <Plus size={32} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-black uppercase">Upload ID Image</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                            </label>
                        </>
                    ) : (
                        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex items-start gap-4">
                            {isVerified ? (
                                <CheckCircle2 className="text-emerald-500 mt-1" size={24} />
                            ) : (
                                <Clock className="text-amber-500 mt-1" size={24} />
                            )}
                            <div>
                                <h4 className="text-black font-black text-lg">
                                    {isVerified ? "ID Verified" : "Verification in Progress"}
                                </h4>
                                <p className="text-zinc-500 font-bold text-sm mt-1">
                                    {isVerified 
                                        ? "Your account is fully verified. You now have a verified vendor badge."
                                        : "We are currently reviewing your government ID. This usually takes 24-48 hours."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Phone Number */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-black font-black text-2xl">Phone Number</h2>
                    <span className="bg-[#EAB308] text-white px-3 py-1 rounded text-[10px] font-black uppercase">In review</span>
                </div>
                <p className="text-zinc-500 font-bold text-sm mb-12">Confirm your phone number so buyers and sellers can reach you.</p>

                <div className="max-w-2xl space-y-8">
                    <input
                        type="text"
                        defaultValue="+234 8100909 000"
                        disabled
                        className="w-full border border-zinc-200 rounded-lg p-4 text-zinc-400 font-bold bg-zinc-50"
                    />

                    <button className="bg-orange-200 text-white font-black py-4 px-12 rounded-xl cursor-not-allowed min-w-[200px]">
                        Under review
                    </button>
                </div>
            </div>

            {/* Email Address */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-black font-black text-2xl">Email Address</h2>
                    <span className="bg-[#10B981] text-white px-3 py-1 rounded text-[10px] font-black uppercase">Verified</span>
                </div>
                <p className="text-zinc-500 font-bold text-sm mb-12">Secure your account and receive important updates.</p>

                <div className="max-w-2xl space-y-8">
                    <input
                        type="text"
                        defaultValue="example@email.com"
                        disabled
                        className="w-full border border-zinc-200 rounded-lg p-4 text-zinc-400 font-bold bg-zinc-50"
                    />

                    <button className="bg-orange-300 text-white font-black py-4 px-12 rounded-xl cursor-not-allowed min-w-[200px]">
                        Verified
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChevronDownIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
