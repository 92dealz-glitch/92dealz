"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  X,
  Clock,
  Zap,
  ChevronRight,
  Mail
} from "lucide-react";
import Link from "next/link";
import { getMyProfile } from "@/lib/api";

interface VendorTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VendorTasksModal: React.FC<VendorTasksModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to load profile for tasks", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isPhoneVerified = !!profile?.is_phone_verified;
  const isEmailVerified = !!profile?.is_email_verified;
  const isIdentityVerified = profile?.verification_status === "approved";

  // New logic for primary task
  const needsPhone = !isPhoneVerified;
  const needsEmail = !isEmailVerified;

  const TaskItem = ({ 
    icon: Icon, 
    title, 
    isCompleted, 
    buttonText, 
    href, 
    infoOnly = false 
  }: { 
    icon: any; 
    title: string; 
    isCompleted?: boolean; 
    buttonText?: string; 
    href?: string;
    infoOnly?: boolean;
  }) => (
    <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 mb-3 transition-all hover:border-orange-200">
      <div className={`p-2.5 rounded-xl ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-zinc-900 leading-snug">{title}</h4>
        {infoOnly ? (
          <p className="text-[11px] text-zinc-500 mt-1 font-medium italic">Informational item • No action required</p>
        ) : !isCompleted ? (
          <Link 
            href={href || "#"} 
            onClick={onClose}
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-white bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition-all shadow-sm shadow-orange-100"
          >
            {buttonText}
            <ChevronRight size={14} />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
            <CheckCircle2 size={14} />
            Completed
          </div>
        )}
      </div>
      {!infoOnly && isCompleted && (
        <CheckCircle2 className="text-green-500 shrink-0" size={24} />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300 border border-zinc-100">
        {/* Header */}
        <div className="bg-orange-600 p-6 sm:p-8 relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-3 rounded-2xl text-white">
              <Zap size={24} fill="white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-none">Info for the Vendor</h3>
              <p className="text-orange-100 text-sm mt-2 font-medium">Complete these steps to unlock full potential</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-zinc-400 text-xs font-bold mt-4">Syncing your progress...</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Phone Verification Task - Only show if actually missing */}
              {!isPhoneVerified && (
                <TaskItem 
                  icon={Phone}
                  title="In order to list an Ad please verify your Phone Number"
                  isCompleted={isPhoneVerified}
                  buttonText="Verify Phone Number"
                  href="/account-settings"
                />
              )}

              {/* Email Verification Task - Only show if actually missing */}
              {!isEmailVerified && (
                <TaskItem 
                  icon={Mail} 
                  title="You have to add and verify an email address in order to post an ad"
                  isCompleted={isEmailVerified}
                  buttonText="Verify Email Address"
                  href="/account-settings"
                />
              )}

              {/* Trust/UX Note - Only show if any verification is missing */}
              {(!isPhoneVerified || !isEmailVerified) && (
                <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                  <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">Boost User Trust</p>
                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                      Verification is mandatory for the <span className="text-blue-900 underline decoration-blue-300">Best User Experience</span>. 
                      Verified vendors get 3x more visibility and higher trust from potential buyers.
                    </p>
                  </div>
                </div>
              )}

              <div className="h-4" /> {/* Spacer */}

              <TaskItem 
                icon={Clock}
                title="When a new ad is created, its status is pending, and when 234deals support approves the ad It will be Listed."
                infoOnly
              />

              <TaskItem 
                icon={ShieldCheck}
                title="Become a verified Vendor to be able to gain trust and get more visibility"
                isCompleted={isIdentityVerified}
                buttonText="Get Verified Now"
                href="/vendor-dashboard/settings/verification"
              />

              <TaskItem 
                icon={ExternalLink}
                title="For Additional Promotion You can use Featured ads Plan."
                infoOnly
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest leading-none mb-4">You can revisit this list from your profile</p>
          <button 
            onClick={onClose}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-zinc-100"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorTasksModal;
