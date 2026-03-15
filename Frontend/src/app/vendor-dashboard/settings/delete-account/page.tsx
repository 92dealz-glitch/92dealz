"use client";
import React from "react";
import { Eye } from "lucide-react";

export default function DeleteAccountPage() {
    return (
        <div className="animate-in fade-in duration-500 flex flex-col md:flex-row gap-8">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-8 lg:p-12 max-w-2xl flex-1">
                <h2 className="text-black font-black text-2xl mb-1">Delete Account</h2>
                <p className="text-zinc-500 font-bold text-xs mb-12 border-b border-zinc-100 pb-8">
                    Deleting your account is permanent. All your listings, messages, and profile data will be removed and cannot be recovered.
                </p>

                <form className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <label className="text-black font-black text-lg">Enter your password to confirm</label>
                        <div className="relative max-w-sm">
                            <input
                                type="password"
                                className="w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors pr-12"
                            />
                            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors">
                                <Eye size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="relative max-w-sm">
                        <select 
                            defaultValue=""
                            className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors bg-white"
                        >
                            <option value="" disabled>Tell us why you&apos;re leaving</option>
                            <option>I have too many spam messages</option>
                            <option>I couldn&apos;t find what I was looking for</option>
                            <option>I have privacy or security concerns</option>
                            <option>The website is difficult to navigate</option>
                            <option>Other (please specify)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                            <ChevronDownIcon />
                        </div>
                    </div>

                    <button className="bg-[#FF4D4D] hover:bg-red-600 text-white font-black py-3 px-8 rounded-lg transition-all shadow-lg shadow-red-100 min-w-[200px]">
                        Delete account
                    </button>
                </form>
            </div>

            <div className="w-full md:w-64 flex-shrink-0">
                <h3 className="text-zinc-400 font-black text-xl mb-6">Reasons for leaving</h3>
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                    {[
                        "I have too many spam messages",
                        "I couldn't find what I was looking for",
                        "I have privacy or security concerns",
                        "The website is difficult to navigate",
                        "Other (please specify)"
                    ].map((reason, i) => (
                        <div key={i} className={`p-4 text-xs font-bold text-zinc-500 hover:bg-zinc-50 cursor-pointer transition-colors ${i !== 4 ? "border-b border-zinc-100" : ""}`}>
                            {reason}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ChevronDownIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
