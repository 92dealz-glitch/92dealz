"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useRouter } from "next/navigation";

export default function VendorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== "undefined") {
            const role = window.localStorage.getItem("role") || "";
            if (role.toLowerCase() !== "vendor") {
                router.replace("/login");
            }
        }
    }, [router]);
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
