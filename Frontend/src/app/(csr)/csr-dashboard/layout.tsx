"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CSRSidebar from "@/components/csr/CSRSidebar";
import { useRouter } from "next/navigation";

export default function CSRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = window.localStorage.getItem("role") || "";
      if (role.toLowerCase() !== "csr" && role.toLowerCase() !== "admin") {
        router.replace("/csr-login");
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

  // Heartbeat to track time spent online
  useEffect(() => {
    if (isChecking) return;
    
    // Ping immediately when mounted
    let active = true;
    const pingServer = async () => {
      try {
        const token = window.localStorage.getItem("token");
        if (!token) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/staff/ping`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Ping error", err);
      }
    };

    pingServer();
    // Then every 60 seconds ping the server
    const interval = setInterval(() => {
      if (active) pingServer();
    }, 60000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isChecking]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-bold text-orange-600">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <CSRSidebar />
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
