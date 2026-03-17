import { API_BASE } from "@/services/apiClient";

export type Column = {
  heading: string;
  items: string[];
};

export type CategoryData = {
  id: number;
  title: string;
  icon?: string;
  columns: Column[];
  specifications_template: any[];
};

export type BackendCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  mega_menu: { columns: Column[] } | null;
  specifications_template: any[] | null;
};

let cachedCategories: Record<string, CategoryData> | null = null;

// Provider functions: dynamically fetch from API
export async function getCategories(): Promise<Record<string, CategoryData>> {
  if (cachedCategories) return cachedCategories;
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const result: Record<string, CategoryData> = {};
      json.data.forEach((cat: BackendCategory) => {
        result[cat.slug] = {
          id: cat.id,
          title: cat.name,
          icon: cat.icon || "",
          columns: cat.mega_menu?.columns || [],
          specifications_template: cat.specifications_template || []
        };
      });
      cachedCategories = result;
      return result;
    }
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
  return {};
}

export async function getCategory(key: string): Promise<CategoryData | undefined> {
  const all = await getCategories();
  return all[key];
}

export async function getFallbackArray() {
  const all = await getCategories();
  return Object.keys(all).map((key) => ({
    id: key, // slug
    catId: all[key].id,
    title: all[key].title,
    icon: all[key].icon || "/assets/images/tag.svg",
    columns: all[key].columns,
    specifications_template: all[key].specifications_template
  }));
}
