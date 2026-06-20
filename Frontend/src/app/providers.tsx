"use client";
import { SessionProvider } from "next-auth/react";
import VisitTracker from "@/components/VisitTracker";
import React from "react";
import SessionSync from "@/components/auth/SessionSync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <VisitTracker />
      <SessionSync />
      {children}
    </SessionProvider>
  );
}


