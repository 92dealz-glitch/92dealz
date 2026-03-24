"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessagingClient from "@/components/messaging/MessagingClient";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1 px-0 sm:px-4 py-0 sm:py-8">
        <React.Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 min-h-[400px]"><Loader2 className="animate-spin text-orange-600" size={48} /></div>}>
          <MessagingClient />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}
