"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MessagingClient from "@/components/messaging/MessagingClient";

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <MessagingClient />
      </main>
      <Footer />
    </div>
  );
}
