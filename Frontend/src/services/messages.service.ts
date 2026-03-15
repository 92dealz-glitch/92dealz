import { apiFetch } from "./apiClient";

export interface Thread {
  other_id: number;
  other_name?: string;
  last_id: number;
  last_content: string;
  last_created_at: string;
  unread_count: number;
  deal_id?: number | null;
  deal_title?: string;
}

export async function listThreads() {
  return apiFetch<{ success: boolean; data: Thread[] }>("/messages/threads", { method: "GET" }, true);
}

export async function getThread(userId: number, dealId?: number) {
  const q = new URLSearchParams({ userId: String(userId), ...(dealId ? { dealId: String(dealId) } : {}) }).toString();
  return apiFetch<{ success: boolean; data: any[] }>(`/messages/thread?${q}`, { method: "GET" }, true);
}

export async function sendMessage(to_user_id: number, content: string, deal_id?: number) {
  return apiFetch<{ success: boolean; data: { id: number } }>(
    "/messages",
    { method: "POST", body: JSON.stringify({ to_user_id, content, deal_id }) },
    true
  );
}

