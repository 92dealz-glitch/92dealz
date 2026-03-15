"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserSidebar from "@/components/dashboard/UserSidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = window.localStorage.getItem("role") || "";
      if (role.toLowerCase() !== "user") {
        router.replace("/login");
      }
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-[1440px] mx-auto w-full">
        <UserSidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
