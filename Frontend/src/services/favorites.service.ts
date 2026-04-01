import { apiFetch } from "./apiClient";
import { ENDPOINTS } from "@/utils/constants";

export async function addFavorite(deal_id: number) {
  return apiFetch<{ success: boolean; data: any; message?: string }>(ENDPOINTS.favorites, {
    method: "POST",
    body: JSON.stringify({ deal_id }),
  }, true);
}

export async function listFavorites() {
  return apiFetch<{ success: boolean; data: any[] }>(ENDPOINTS.favorites, { method: "GET" }, true);
}

export async function removeFavorite(dealId: number) {
  return apiFetch<{ success: boolean; message: string }>(`${ENDPOINTS.favorites}/${dealId}`, { method: "DELETE" }, true);
}
