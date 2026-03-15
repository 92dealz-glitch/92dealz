import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color: string; // e.g., "orange", "green", "blue", "purple"
  bgColor: string; // Background color for the icon container
  iconColor: string; // Icon color
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color,
  bgColor,
  iconColor
}: StatCardProps) {
  // Map color names to Tailwind light backgrounds for the card itself
  const cardBgColors: { [key: string]: string } = {
    orange: "bg-[#FFF0EB]",
    green: "bg-[#E6FAEF]",
    yellow: "bg-[#FFF9E6]",
    purple: "bg-[#F3E8FF]",
    blue: "bg-[#E6F0FF]",
  };

  return (
    <div className={`${cardBgColors[color] || "bg-white"} p-6 rounded-2xl border border-zinc-100 flex flex-col justify-between h-full shadow-sm`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-zinc-600 text-[14px] font-medium mb-1">{label}</span>
          <span className="text-2xl font-bold text-zinc-900">{value}</span>
        </div>
        <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={iconColor} size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1">
          {trend.isUp ? (
            <TrendingUp size={16} className="text-green-600" />
          ) : (
            <TrendingDown size={16} className="text-red-600" />
          )}
          <span className={`text-[12px] font-bold ${trend.isUp ? "text-green-600" : "text-red-600"}`}>
            {trend.value} <span className="text-zinc-500 font-normal">this month</span>
          </span>
        </div>
      )}
    </div>
  );
}
