"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import SessionSync from "@/components/auth/SessionSync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
