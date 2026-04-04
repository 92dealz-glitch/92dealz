"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function VerificationTaskBar() {
  const { user } = useAuth();

  if (!user) return null;
  
  // Only show if logged in but not fully verified
  const isFullyVerified = user.is_phone_verified && user.is_email_verified;
  
  if (isFullyVerified) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2.5 px-4 shadow-md overflow-hidden relative group">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="tracking-wide">Complete your signup for better security and access to all vendor details.</span>
        </div>
        
        <Link 
          href="/vendor-dashboard/settings/verification" 
          className="bg-white text-orange-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-orange-50 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
        >
          Verify Profile Now
        </Link>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
    </div>
  );
}
