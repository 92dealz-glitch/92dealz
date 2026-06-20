"use client";
import React from "react";
import Link from "next/link";
import { useNavUserDetails } from "@/hooks/useNavUserDetails";

export default function VerificationTaskBar() {
  const { isFullyVerified, role } = useNavUserDetails();
  const isLoggedIn = !!(typeof window !== "undefined" ? window.localStorage.getItem("token") : null);

  if (!isLoggedIn) return null;
  
  // Only show if logged in but not fully verified
  if (isFullyVerified) return null;

  // Role-based link
  const verificationLink = role === "vendor" || role === "Vendor"
    ? "/vendor-dashboard/settings/verification"
    : "/account-settings";

  return (
    <div className="bg-gradient-to-r from-[#708238] to-[#5E6E2F] text-white py-2.5 px-4 shadow-md overflow-hidden relative group">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="tracking-wide text-center">Complete your signup for better security and access to all vendor details.</span>
        </div>
        
        <Link 
          href={verificationLink} 
          className="bg-white text-[#708238] px-4 py-1 rounded-md text-xs font-bold hover:bg-[#E9E0D4] transition-all transform hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
        >
          Verify Profile Now
        </Link>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
    </div>
  );
}


