import { apiFetch } from "./apiClient";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read_at: string | null;
  createdAt: string;
}

export async function getNotifications() {
  return apiFetch<{ success: boolean; data: AppNotification[] }>("notifications", {}, true);
}

export async function markAsRead(id: string) {
  return apiFetch<{ success: boolean }>(`notifications/${id}/read`, { method: "PATCH" }, true);
}

export async function markAllRead() {
  return apiFetch<{ success: boolean }>("notifications/mark-all-read", { method: "POST" }, true);
}

export async function deleteNotification(id: string) {
  return apiFetch<{ success: boolean }>(`notifications/${id}`, { method: "DELETE" }, true);
}
