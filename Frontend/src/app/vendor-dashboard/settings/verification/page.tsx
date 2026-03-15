"use client";
import React from "react";
import { Upload, Plus } from "lucide-react";

export default function VerificationPage() {
    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            {/* Account Verification */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-black font-black text-2xl">Account verification</h2>
                    <span className="bg-zinc-500 text-white px-3 py-1 rounded text-[10px] font-black uppercase">Not verified</span>
                </div>
                <p className="text-zinc-500 font-bold text-sm mb-12">Help other users trust you by verifying your account.</p>

                <div className="max-w-2xl space-y-8">
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

                    <div className="aspect-[2/1] max-w-sm rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#E85A28] hover:bg-orange-50 transition-all text-zinc-400 hover:text-[#E85A28]">
                        <Plus size={32} />
                        <span className="text-sm font-black uppercase">Upload Image</span>
                    </div>

                    <button className="bg-[#E85A28] hover:bg-[#D44D1F] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]">
                        Verify Now
                    </button>
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
