"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/api";
import { Clock, Store, TrendingUp } from "lucide-react";

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [status, setStatus] = useState<string>("loading");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const role = (window.localStorage.getItem("role") || "").toLowerCase();
            if (role !== "vendor" && role !== "admin") {
                setStatus("upgrade_required");
                return;
            }
            
            // Fetch real-time status from server
            getMyProfile()
                .then((res: any) => {
                    if (res?.data?.status) {
                        setStatus(res.data.status);
                    } else {
                        setStatus("active"); // fallback
                    }
                })
                .catch(() => {
                    setStatus("error");
                });
        }
    }, [router]);

    if (status === "loading") {
        return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Loading...</div>;
    }

    if (status === "pending" || status === "rejected" || status === "upgrade_required") {
        const isUpgrade = status === "upgrade_required";
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                    <div className="bg-white p-6 sm:p-12 rounded-2xl shadow-sm border border-zinc-200 max-w-lg w-full text-center">
                        <div className={`w-16 h-16 ${isUpgrade ? 'bg-orange-50' : 'bg-amber-50'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                            {isUpgrade ? (
                                <TrendingUp size={32} className="text-orange-500" />
                            ) : (
                                <Clock size={32} className="text-amber-500" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                            {isUpgrade ? "Post an Ad" : `Account ${status === "pending" ? "Pending Approval" : "Suspended"}`}
                        </h2>
                        <p className="text-zinc-500 mb-8">
                            {isUpgrade 
                                ? "Please Upgrade your account into vendor inorder to add a product."
                                : status === "pending" 
                                    ? "Your vendor account is currently under review by our team. You will be able to access your dashboard and start selling once approved." 
                                    : "Your vendor account has been rejected or suspended. Please contact support for more information."}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => router.push(isUpgrade ? "/account-settings" : "/")}
                                className="px-6 py-3 bg-[#f45c03] text-white font-bold rounded-xl hover:bg-[#f45c03] transition-colors"
                            >
                                {isUpgrade ? "Go to Account Settings" : "Return to Homepage"}
                            </button>
                            {isUpgrade && (
                                <button 
                                    onClick={() => router.push("/")}
                                    className="px-6 py-3 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                                >
                                    Return to Homepage
                                </button>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <DashboardSidebar />
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}


