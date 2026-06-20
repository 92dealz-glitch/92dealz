"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * SessionSync handles real-time synchronization between the NextAuth session 
 * and persistent storage (localStorage) used by other API services.
 */
export default function SessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const role = String((session.user as any)?.role || "").toLowerCase();
      const token = (session.user as any)?.accessToken;
      const userId = (session.user as any)?.id;

      if (typeof window !== "undefined") {
        if (role) localStorage.setItem("role", role);
        if (token) localStorage.setItem("token", token);
        if (userId) localStorage.setItem("user_id", String(userId));
      }
    } else if (status === "unauthenticated") {
      if (typeof window !== "undefined") {
        // Only clear if we were previously logged in (avoid clearing on initial guest load if needed)
        // But for security, clearing on unauthenticated is safe.
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
      }
    }
  }, [session, status]);

  return null; // This component doesn't render anything
}


