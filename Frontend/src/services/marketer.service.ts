"use client";
import { apiFetch } from "./apiClient";

export interface MarketerOverview {
  total_marketers: number;
  total_vendors: number;
  monthly_commission: number;
  target_progress: number; // 0-100
}

export async function getMarketerOverview() {
  return apiFetch<{ success: boolean; data: MarketerOverview }>("/marketer/overview", { method: "GET" }, true);
}

