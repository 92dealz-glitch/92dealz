import { apiFetch } from "./apiClient";

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("image", file);
  
  const data = await apiFetch<{ success: boolean; url: string }>("/uploads/image", {
    method: "POST",
    body: form,
  }, true);
  
  return { url: data.url };
}

