import { apiFetch } from "./apiClient";

const BASE = "/ads";

export interface AdPayload {
  title: string;
  description?: string | null;
  price: number;
  category_id?: number | null;
  images?: string[] | string;
  status?: "active" | "sold" | "draft" | "closed";
  condition?: string;
  brand?: string;
  model?: string;
  color?: string;
  negotiable?: string;
  screenSize?: string;
  ram?: string;
  mainCamera?: string;
  selfieCamera?: string;
  battery?: string;
  internalStorage?: string;
  state?: string;
  city?: string;
  location?: string;
  subcategory?: string;
  specifications?: Record<string, any>;
}

export async function listActiveAds(params?: { limit?: number; page?: number; sort?: string; dir?: string; category_id?: number; category_name?: string; random?: string; state?: string; city?: string; location?: string }) {
  let url = BASE;
  if (params) {
    const q = new URLSearchParams();
    if (params.limit) q.set("limit", params.limit.toString());
    if (params.page) q.set("page", params.page.toString());
    if (params.sort) q.set("sort", params.sort);
    if (params.dir) q.set("dir", params.dir);
    if (params.category_id) q.set("category_id", params.category_id.toString());
    if (params.category_name) q.set("category_name", params.category_name);
    if (params.state) q.set("state", params.state);
    if (params.city) q.set("city", params.city);
    if (params.location) q.set("location", params.location);
    if (params.random) q.set("random", params.random);
    const qs = q.toString();
    if (qs) url += `?${qs}`;
  }
  return apiFetch<{ success: boolean; data: any[] }>(url, { method: "GET" }, false);
}

export async function listTrendingAds(params?: { location?: string; state?: string; city?: string }) {
  let url = `${BASE}/trending`;
  if (params) {
    const q = new URLSearchParams();
    if (params.location) q.set("location", params.location);
    if (params.state) q.set("state", params.state);
    if (params.city) q.set("city", params.city);
    const qs = q.toString();
    if (qs) url += `?${qs}`;
  }
  return apiFetch<{ success: boolean; data: any[] }>(url, { method: "GET" }, false);
}

export async function listMyAds(status?: string) {
  let url = `${BASE}/vendor`;
  if (status) url += `?status=${status}`;
  return apiFetch<{ success: boolean; data: any[] }>(url, { method: "GET" }, true);
}

export async function createAd(payload: AdPayload) {
  const body: any = {
    title: payload.title,
    description: payload.description ?? null,
    price: payload.price,
    status: payload.status ?? "active",
    condition: payload.condition,
    brand: payload.brand,
    model: payload.model,
    color: payload.color,
    negotiable: payload.negotiable,
    screenSize: payload.screenSize,
    ram: payload.ram,
    mainCamera: payload.mainCamera,
    selfieCamera: payload.selfieCamera,
    battery: payload.battery,
    internalStorage: payload.internalStorage,
    state: payload.state,
    city: payload.city,
    location: payload.location || (payload.city && payload.state ? `${payload.city}, ${payload.state}` : payload.state || payload.city),
    subcategory: payload.subcategory,
    specifications: payload.specifications,
  };
  if (payload.category_id !== undefined) body.category_id = payload.category_id;
  if (payload.images) {
    if (Array.isArray(payload.images)) {
      body.images_json = JSON.stringify(payload.images);
      if (payload.images.length > 0) body.image_url = payload.images[0];
    } else {
      body.image_url = payload.images;
    }
  }
  const path = BASE;

  return apiFetch<{ success: boolean; data: any }>(path, { method: "POST", body: JSON.stringify(body) }, true);
}

export async function updateAd(id: number, payload: Partial<AdPayload>) {
  const body: any = { ...payload };
  if (payload.images) {
    const first = Array.isArray(payload.images) ? payload.images[0] : payload.images;
    body.image_url = first;
    delete body.images;
  }
  return apiFetch<{ success: boolean; data: any }>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(body) }, true);
}

export async function deleteAd(id: number) {
  return apiFetch<{ success: boolean; message: string }>(`${BASE}/${id}`, { method: "DELETE" }, true);
}

export async function markAdSold(id: number) {
  return apiFetch<{ success: boolean; data: any }>(`${BASE}/${id}/sold`, { method: "PATCH" }, true);
}
