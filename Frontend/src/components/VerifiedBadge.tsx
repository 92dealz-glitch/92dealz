import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function VerifiedBadge({ className = "", size = 16, showText = false }: Props) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} title="Verified Vendor">
      <div className="bg-[#FFFDF9]/300 text-white rounded-full p-0.5 flex items-center justify-center shadow-sm">
        <CheckCircle2 size={size - 4} fill="white" stroke="rgb(16, 185, 129)" />
      </div>
      {showText && (
        <span className="text-emerald-600 font-black text-[11px] uppercase tracking-wider">
          Verified
        </span>
      )}
    </div>
  );
}


