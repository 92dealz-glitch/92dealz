export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://234deals-backend.vercel.app/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function apiFetch<T>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const url = `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth) {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export interface RegisterPayload {
  name: string;
  contact: string;
  method: string;
  password: string;
  phone?: string | null;
  role?: "user" | "vendor" | "admin";
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
}

export async function registerUser(payload: RegisterPayload) {
  return apiFetch<{ success: boolean; message: string }>(
    "/auth/signup",
    { method: "POST", body: payload }
  );
}

export async function registerInitiate(payload: RegisterPayload) {
  return apiFetch<{ success: boolean; message: string }>(
    "/auth/register-initiate",
    { method: "POST", body: payload }
  );
}

export async function registerVerify(payload: { contact: string; method: string; otp: string }) {
  return apiFetch<{ success: boolean; message: string; user?: any }>(
    "/auth/register-verify",
    { method: "POST", body: payload }
  );
}

export async function loginUser(payload: {
  email: string;
  password: string;
}) {
  const data = await apiFetch<{
    success: boolean;
    token: string;
    user: { id: number; name: string; email: string; role?: string; phone?: string | null };
  }>("/auth/login", { method: "POST", body: payload });
  if (typeof window !== "undefined") {
    window.localStorage.setItem("token", data.token);
    if (data.user?.role) window.localStorage.setItem("role", String(data.user.role));
    if (data.user?.id) window.localStorage.setItem("user_id", String(data.user.id));
  }
  return data;
}

export async function getProfile() {
  return apiFetch<{ success: boolean; data: unknown }>(
    "/users/profile",
    { method: "GET", auth: true }
  );
}

export async function updateProfile(payload: { 
  name?: string; 
  phone?: string | null;
  profile_image_url?: string | null;
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  about?: string;
}) {
  return apiFetch<{ success: boolean; data: unknown }>(
    "/users/profile",
    { method: "PUT", body: payload, auth: true }
  );
}

export async function upgradeToVendor(payload: { businessName: string; businessCategory: string; businessAddress: string }) {
  return apiFetch<{ success: boolean; message: string }>(
    "/users/upgrade-vendor",
    { method: "POST", body: payload, auth: true }
  );
}

export async function updateProfileImage(url: string | null) {
  return apiFetch<{ success: boolean; data: unknown }>(
    "/users/profile",
    { method: "PUT", body: { profile_image_url: url }, auth: true }
  );
}

export async function getMyProfile() {
  return apiFetch<{ success: boolean; data: { id: number; name: string; email: string; phone?: string | null; profile_image_url?: string | null; businessName?: string | null; businessCategory?: string | null; businessAddress?: string | null; about?: string | null; status?: string } }>(
    "/users/profile",
    { method: "GET", auth: true }
  );
}

export async function getDeals() {
  return apiFetch<{ success: boolean; data: any[] }>(
    "/deals",
    { method: "GET", auth: true }
  );
}

export async function createDeal(payload: any) {
  return apiFetch<{ success: boolean; data: any }>(
    "/deals",
    { method: "POST", body: payload, auth: true }
  );
}

export async function updateDeal(id: number, payload: any) {
  return apiFetch<{ success: boolean; data: any }>(
    `/deals/${id}`,
    { method: "PUT", body: payload, auth: true }
  );
}

export async function deleteDeal(id: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `/deals/${id}`,
    { method: "DELETE", auth: true }
  );
}

export async function forgotPassword(payload: { email: string }) {
  return apiFetch<{ success: boolean; message: string }>(
    "/auth/forgot-password",
    { method: "POST", body: payload }
  );
}

export async function verifyOtp(payload: { email: string; otp: string }) {
  return apiFetch<{ success: boolean; message: string }>(
    "/auth/verify-otp",
    { method: "POST", body: payload }
  );
}

export async function resetPassword(payload: { email: string; newPassword: string }) {
  return apiFetch<{ success: boolean; message: string }>(
    "/auth/reset-password",
    { method: "POST", body: payload }
  );
}

// Admin APIs
export async function getAdminVendors() {
  return apiFetch<{ success: boolean; data: any[] }>(
    "/admin/vendors",
    { method: "GET", auth: true }
  );
}

export async function updateAdminVendorStatus(id: number, status: "pending" | "active" | "rejected") {
  return apiFetch<{ success: boolean; data: any }>(
    `/admin/vendors/${id}/status`,
    { method: "PUT", body: { status }, auth: true }
  );
}

export async function deleteAdminVendor(id: number) {
  return apiFetch<{ success: boolean; message: string }>(
    `/admin/vendors/${id}`,
    { method: "DELETE", auth: true }
  );
}

export async function getAdminSubmissions(page = 1, limit = 50) {
  return apiFetch<{ success: boolean; data: any[]; meta: any }>(
    `/admin/submissions?page=${page}&limit=${limit}`,
    { method: "GET", auth: true }
  );
}

export async function updateAdminSubmissionStatus(id: number, status: "APPROVED" | "REJECTED") {
  return apiFetch<{ success: boolean; data: any }>(
    `/admin/submissions/${id}`,
    { method: "PUT", body: { status }, auth: true }
  );
}

export async function getAdminCategories() {
  return apiFetch<{ success: boolean; data: any[] }>(
    "/admin/categories",
    { method: "GET", auth: true }
  );
}
