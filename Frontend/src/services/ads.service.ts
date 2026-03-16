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
  const role = typeof window !== "undefined" ? window.localStorage.getItem("role") : "user";
  const path = role === "vendor" ? "/submissions" : BASE;

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
