import { apiFetch } from "./apiClient";
import { ENDPOINTS } from "@/utils/constants";

export interface SearchParams {
  q?: string;
  category_id?: number;
  store_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
}

export async function searchDeals(params: SearchParams) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.category_id) qs.set("category_id", String(params.category_id));
  if (params.store_id) qs.set("store_id", String(params.store_id));
  if (params.min_price !== undefined) qs.set("min_price", String(params.min_price));
  if (params.max_price !== undefined) qs.set("max_price", String(params.max_price));
  if (params.sort) qs.set("sort", params.sort);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  const path = `${ENDPOINTS.search}${query ? `?${query}` : ""}`;
  return apiFetch<{ success: boolean; data: any[]; meta: { page: number; limit: number; total: number; pages: number } }>(path);
}
