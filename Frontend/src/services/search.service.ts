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
  userId?: number | string;
  subcategory?: string;
}

export async function searchDeals(params: SearchParams) {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.category_id !== undefined && params.category_id !== null) qs.set("category_id", String(params.category_id));
  if (params.subcategory) qs.set("subcategory", params.subcategory);
  if (params.store_id !== undefined && params.store_id !== null) qs.set("store_id", String(params.store_id));
  if (params.min_price !== undefined && params.min_price !== null) qs.set("min_price", String(params.min_price));
  if (params.max_price !== undefined && params.max_price !== null) qs.set("max_price", String(params.max_price));
  if (params.sort) qs.set("sort", params.sort);
  if (params.page !== undefined && params.page !== null) qs.set("page", String(params.page));
  if (params.limit !== undefined && params.limit !== null) qs.set("limit", String(params.limit));
  if (params.userId !== undefined && params.userId !== null) qs.set("userId", String(params.userId));
  const query = qs.toString();
  const path = `${ENDPOINTS.search}${query ? `?${query}` : ""}`;
  return apiFetch<{ success: boolean; data: any[]; meta: { page: number; limit: number; total: number; pages: number } }>(path);
}
