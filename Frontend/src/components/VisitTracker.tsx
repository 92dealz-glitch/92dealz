"use client";
import { useEffect } from "react";
import { API_BASE } from "@/services/apiClient";

export default function VisitTracker() {
  useEffect(() => {
    async function trackVisit() {
      try {
        let visitorId = localStorage.getItem("visitorId");
        if (!visitorId) {
          visitorId = self.crypto.randomUUID();
          localStorage.setItem("visitorId", visitorId);
        }

        if (visitorId) {
          await fetch(`${API_BASE}/analytics/log-visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitor_id: visitorId }),
          });
        }
      } catch (err) {
        console.error("[VisitTracker] Failed to log visit:", err);
      }
    }

    trackVisit();
  }, []);

  return null;
}
