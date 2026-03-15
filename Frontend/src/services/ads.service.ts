import { apiFetch } from "./apiClient";

const BASE = "/ads";

export interface AdPayload {
  title: string;
  description?: string | null;
  price: number;
  category_id?: number | null;
  images?: string[] | string;
  status?: "active" | "sold" | "draft" | "closed";
}

export async function listActiveAds() {
  return apiFetch<{ success: boolean; data: any[] }>(BASE, { method: "GET" }, false);
}

export async function listMyAds() {
  return apiFetch<{ success: boolean; data: any[] }>(`${BASE}/vendor`, { method: "GET" }, true);
}

export async function createAd(payload: AdPayload) {
  const body: any = {
    title: payload.title,
    description: payload.description ?? null,
    price: payload.price,
    status: payload.status ?? "active",
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
  return apiFetch<{ success: boolean; data: any }>(BASE, { method: "POST", body: JSON.stringify(body) }, true);
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
