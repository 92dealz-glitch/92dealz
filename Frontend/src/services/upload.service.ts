import { API_BASE, apiFetch } from "./apiClient";

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_BASE}/uploads/image`, {
    method: "POST",
    headers: (() => {
      const h: Record<string, string> = {};
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("token");
        if (token) h["Authorization"] = `Bearer ${token}`;
      }
      return h;
    })(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || "Upload failed";
    throw new Error(msg);
  }
  
  // The backend now returns an absolute URL (e.g. https://res.cloudinary.com/...)
  return { url: data.url };
}

