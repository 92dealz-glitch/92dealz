import { apiFetch } from "./apiClient";
import { ENDPOINTS } from "@/utils/constants";

export async function getCategories() {
  return apiFetch<{ success: boolean; data: { id: number; name: string; slug: string }[] }>(ENDPOINTS.categories);
}
