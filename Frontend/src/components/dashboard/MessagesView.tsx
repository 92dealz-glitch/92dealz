"use client";
import React from "react";
import { MessageSquare } from "lucide-react";

export default function MessagesView() {
    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden p-12 lg:p-24 flex flex-col items-center justify-center text-center">
            <h2 className="text-black font-black text-2xl mb-12 self-start">Messages</h2>

            <div className="flex flex-col items-center max-w-sm">
                <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-10 text-[#E85A28]">
                    <MessageCircleIcon />
                </div>

                <h3 className="text-black font-extrabold text-lg mb-3">3 Unread Messages</h3>
                <p className="text-zinc-500 font-bold text-[15px] mb-10 leading-relaxed">
                    Stay connected with potential buyers through our messaging system
                </p>

                <button className="bg-[#E85A28] hover:bg-[#D44D1F] text-white font-black py-3.5 px-12 rounded-lg transition-all shadow-lg shadow-orange-100 min-w-[200px]">
                    View Messages
                </button>
            </div>
        </div>
    );
}

function MessageCircleIcon() {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M52.5 27.5C52.5 39.9264 42.4264 50 30 50C26.1118 50 22.4594 49.0041 19.2687 47.2831L7.5 52.5L12.7169 40.7313C11.0041 37.5406 10 33.8882 10 30C10 17.5736 20.0736 7.5 32.5 7.5C44.9264 7.5 55 17.5736 55 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
