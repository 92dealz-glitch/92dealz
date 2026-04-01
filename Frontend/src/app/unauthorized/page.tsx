"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-zinc-100 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6 shadow-sm">
          <ShieldAlert size={40} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black text-zinc-900 mb-2">Access Denied</h1>
        <p className="text-zinc-500 font-bold mb-8 leading-relaxed">
          You don&apos;t have permission to access this area. Restricted to authorized personnel only.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-[#f45c03] text-white font-black py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
          >
            <Home size={18} />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full bg-white border border-zinc-200 text-zinc-700 font-black py-4 rounded-xl hover:bg-zinc-50 transition-all"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-50">
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">
            234Deals Security Protocol
          </p>
        </div>
      </div>
    </div>
  );
}

