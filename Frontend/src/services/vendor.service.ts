"use client";
import { apiFetch } from "./apiClient";

export interface VendorStats {
  total_ads: number;
  total_views: number;
  items_sold: number;
  messages_total: number;
  messages_unread: number;
}

export async function getVendorStats() {
  return apiFetch<{ success: boolean; data: VendorStats }>("/vendor/stats", { method: "GET" }, true);
}



