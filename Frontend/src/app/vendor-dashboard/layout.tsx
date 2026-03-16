"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/lib/api";
import { Clock, Store } from "lucide-react";

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [status, setStatus] = useState<string>("loading");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const role = window.localStorage.getItem("role") || "";
            if (role.toLowerCase() !== "vendor") {
                router.replace("/login");
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

    if (status === "pending" || status === "rejected") {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-zinc-200 max-w-lg w-full text-center">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock size={32} className="text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Account {status === "pending" ? "Pending Approval" : "Suspended"}</h2>
                        <p className="text-zinc-500 mb-8">
                            {status === "pending" 
                                ? "Your vendor account is currently under review by our team. You will be able to access your dashboard and start selling once approved." 
                                : "Your vendor account has been rejected or suspended. Please contact support for more information."}
                        </p>
                        <button 
                            onClick={() => router.push("/")}
                            className="px-6 py-3 bg-[#E85A28] text-white font-bold rounded-xl hover:bg-[#D14F23] transition-colors"
                        >
                            Return to Homepage
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-8 lg:py-12">
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

