import { API_BASE } from "./apiClient";

export async function logAdView(dealId: number) {
  await fetch(`${API_BASE}/analytics/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deal_id: dealId }),
  });
}

export async function logContactView(dealId: number) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  await fetch(`${API_BASE}/analytics/contact`, {
    method: "POST",
    headers,
    body: JSON.stringify({ deal_id: dealId }),
  });
}

export async function getWeeklyAnalytics() {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/vendor/analytics/weekly`, { headers, cache: "no-store" });
  return res.json();
}

