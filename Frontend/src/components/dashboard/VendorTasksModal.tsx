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
    <div className="flex items-start gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 mb-3 transition-all hover:border-[#E9E0D4]">
      <div className={`p-2.5 rounded-xl ${isCompleted ? 'bg-green-100 text-[#708238]' : 'bg-[#E9E0D4] text-[#708238]'}`}>
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
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-white bg-[#708238] px-4 py-2 rounded-lg hover:bg-[#5E6E2F] transition-all shadow-sm shadow-[#E9E0D4]"
          >
            {buttonText}
            <ChevronRight size={14} />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-[#708238] bg-green-50 px-4 py-2 rounded-lg border border-[#E9E0D4]">
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-zinc-100">
        {/* Header */}
        <div className="bg-[#708238] p-5 sm:p-8 shrink-0 relative">
          <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2 pr-8">
            <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-white">
              <Zap size={20} className="sm:w-6 sm:h-6" fill="white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">Info for the Vendor</h3>
              <p className="text-orange-100 text-[10px] sm:text-sm mt-1 sm:mt-2 font-medium opacity-90">Essential steps to unlock your potential</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:p-8 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-[#E9E0D4] border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-zinc-400 text-[10px] font-bold mt-4 tracking-widest uppercase">Syncing your progress...</p>
            </div>
          ) : (
            <div className="space-y-1">
              {!isPhoneVerified && (
                <TaskItem 
                  icon={Phone}
                  title="Verify your Phone Number to start listing Ads"
                  isCompleted={isPhoneVerified}
                  buttonText="Verify Now"
                  href="/account-settings"
                />
              )}

              {!isEmailVerified && (
                <TaskItem 
                  icon={Mail} 
                  title="Verify your email address to post an ad"
                  isCompleted={isEmailVerified}
                  buttonText="Verify Now"
                  href="/account-settings"
                />
              )}

              {(!isPhoneVerified || !isEmailVerified) && (
                <div className="mt-6 p-4 bg-[#E9E0D4]/50 rounded-2xl border border-[#E9E0D4]/30/50 flex gap-3">
                  <ShieldCheck className="text-[#708238] shrink-0" size={18} />
                  <div>
                    <p className="text-xs font-black text-orange-900 mb-1">Boost Sales 300%</p>
                    <p className="text-[10px] text-orange-800 font-bold leading-relaxed opacity-80">
                      Verification is mandatory for a premium experience. 
                      Verified vendors gain significantly higher trust from buyers globally.
                    </p>
                  </div>
                </div>
              )}

              <div className="h-4" /> 

              <TaskItem 
                icon={Clock}
                title="Newly created ads are pending review by our support team."
                infoOnly
              />

              <TaskItem 
                icon={ShieldCheck}
                title="Gain trust and visibility by becoming a Verified Vendor"
                isCompleted={isIdentityVerified}
                buttonText="Get Verified"
                href="/vendor-dashboard/settings/verification"
              />

              <TaskItem 
                icon={ExternalLink}
                title="Scale your business faster with our Featured Ads plans."
                infoOnly
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-8 bg-zinc-50/80 backdrop-blur-sm border-t border-zinc-100 shrink-0">
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-none mb-4 text-center opacity-70">Revisit this list anytime from your profile</p>
          <button 
            onClick={onClose}
            className="w-full bg-zinc-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-zinc-200 text-xs sm:text-sm tracking-widest uppercase"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorTasksModal;


