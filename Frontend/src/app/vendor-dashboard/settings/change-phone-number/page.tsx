"use client";
import React from "react";

export default function ChangePhonePage() {
    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12 animate-in fade-in duration-500 max-w-2xl">
            <h2 className="text-black font-black text-2xl mb-1">Change Phone Number</h2>
            <p className="text-zinc-500 font-bold text-sm mb-12">Update your phone number for buyers and sellers to reach you.</p>

            <form className="space-y-8">
                <div className="flex flex-col gap-2 opacity-60">
                    <label className="text-black font-black text-[15px]">Current phone number</label>
                    <input type="text" defaultValue="+234 8100909 000" disabled className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold bg-zinc-50" />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-black font-black text-[15px]">New phone number</label>
                    <input type="text" placeholder="Enter new phone number" className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#708238] transition-colors" />
                </div>

                <button className="bg-[#708238] hover:bg-[#708238] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-[#E9E0D4] min-w-[200px]">
                    Verify & update
                </button>
            </form>
        </div>
    );
}



