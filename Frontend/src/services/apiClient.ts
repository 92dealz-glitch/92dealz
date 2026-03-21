export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://234deals-backend.vercel.app/api";

export async function apiFetch<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> | undefined) };
  
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const url = `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}
