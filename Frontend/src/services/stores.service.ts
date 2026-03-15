import { apiFetch } from "./apiClient";
import { ENDPOINTS } from "@/utils/constants";

export async function getStores() {
  return apiFetch<{ success: boolean; data: { id: number; name: string; logo?: string | null; website_url?: string | null }[] }>(ENDPOINTS.stores);
}
