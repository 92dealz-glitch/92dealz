"use client";
import React from "react";

interface ActivityItemProps {
    image: string;
    title: string;
    views: number;
    time: string;
    status: string;
}

export function ActivityItem({ image, title, views, time, status }: ActivityItemProps) {
    return (
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 last:border-0">
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-100 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={image || "/assets/images/bgphone.svg"} 
                        alt={title} 
                        className="absolute inset-0 w-full h-full object-cover" 
                    />
                </div>
                <div className="flex flex-col">
                    <h4 className="text-black font-black text-[17px] mb-1">{title}</h4>
                    <span className="text-zinc-500 text-[13px] font-bold">
                        {views} views • {time}
                    </span>
                </div>
            </div>
            <div className="flex items-center">
                <span className={`px-4 py-1.5 rounded-lg text-[13px] font-black tracking-tight ${status === "active"
                    ? "bg-[#10B981] text-white"
                    : "bg-[#4B5563] text-white"
                    }`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

export default function RecentActivity({ ads = [] }: { ads?: any[] }) {
    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
                <h3 className="text-black font-black text-[18px]">Recent Activity</h3>
            </div>
            <div className="flex flex-col">
                {ads.length > 0 ? (
                    ads.map((ad) => (
                        <ActivityItem 
                            key={ad.id} 
                            image={ad.image_url || "/assets/images/bgphone.svg"}
                            title={ad.title}
                            views={ad.views || 0}
                            time={new Date(ad.createdAt).toLocaleDateString()}
                            status={ad.status || "active"}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-zinc-500 font-bold">
                        No recent ads to show.
                    </div>
                )}
            </div>
        </div>
    );
}
