export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function apiFetch<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string> | undefined) };
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
