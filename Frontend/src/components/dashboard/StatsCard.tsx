"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    subtextColor?: string;
    iconText?: string;
    iconColor?: string;
    icon?: LucideIcon;
    growthIndicator?: string;
}

export default function StatsCard({
    label,
    value,
    subtext,
    subtextColor = "text-[#10B981]",
    iconText,
    icon: Icon,
    growthIndicator
}: StatsCardProps) {
    return (
        <div className="bg-white rounded-lg p-6 border border-[#f45c03]/20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col min-h-[140px]">
            <div className="flex justify-between items-start">
                <h3 className="text-black text-[16px] font-black">{label}</h3>
                {Icon && (
                    <Icon size={20} className="text-[#f45c03]" />
                )}
            </div>
            <div className="mt-4 flex-1 flex flex-col justify-end">
                <div className="text-[28px] font-black text-black leading-none mb-4">{value}</div>
                <div className={`text-[12px] font-bold ${subtextColor} flex items-center gap-1`}>
                    {growthIndicator && <span>{growthIndicator}</span>}
                    {subtext}
                </div>
            </div>
        </div>
    );
}

