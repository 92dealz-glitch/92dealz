"use client";
import React from "react";
import Link from "next/link";
import { useNavUserDetails } from "@/hooks/useNavUserDetails";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function VerificationGateModal({ 
  isOpen, 
  onClose, 
  title = "Complete Your Signup", 
  message = "Please complete your signup by verifying both your Email and Phone Number to access chat, messaging, and seller contact information. This ensures a secure and trusted experience for all users." 
}: Props) {
  const { role } = useNavUserDetails();
  const isLoggedIn = !!(typeof window !== "undefined" ? window.localStorage.getItem("token") : null);

  if (!isOpen) return null;

  // Role-based link
  const verificationLink = !isLoggedIn 
    ? "/signup" 
    : (role === "vendor" || role === "Vendor"
        ? "/vendor-dashboard/settings/verification"
        : "/account-settings");

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-10 h-10 text-orange-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            {title}
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            {message}
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href={verificationLink} 
              className="w-full bg-[#f97316] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
              onClick={onClose}
            >
              {!isLoggedIn ? "Sign Up Now" : "Complete Verification"}
            </Link>
            
            <button 
              onClick={onClose}
              className="w-full text-gray-500 py-2 font-medium hover:text-gray-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 text-center">
          <p className="text-xs text-orange-700 font-medium italic">
            "Your security is our priority. We verify all users to ensure a safe marketplace for everyone."
          </p>
        </div>
      </div>
    </div>
  );
}
