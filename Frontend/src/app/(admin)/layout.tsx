"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = window.localStorage.getItem("role") || "";
      if (role.toLowerCase() !== "admin") {
        router.replace("/login");
      }
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <AdminSidebar />
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
