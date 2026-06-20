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

import staticCategories from "./staticCategories.json";

export async function getCategories(): Promise<Record<string, CategoryData>> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      const result: Record<string, CategoryData> = {};
      json.data.forEach((cat: BackendCategory) => {
        result[cat.slug] = {
          id: Number(cat.id),
          title: cat.name,
          icon: cat.icon || "",
          columns: cat.mega_menu?.columns || [],
          specifications_template: cat.specifications_template || []
        };
      });
      // Merge static columns for categories missing mega menu data
      staticCategories.forEach((staticCat) => {
        const key = staticCat.slug;
        if (result[key] && (!result[key].columns || result[key].columns.length === 0)) {
          result[key].columns = (staticCat as any).columns || [];
        }
      });
      return result;
    }
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
  // Fallback to static JSON
  const result: Record<string, CategoryData> = {};
  staticCategories.forEach((cat) => {
    result[cat.slug] = {
      id: Number(cat.id),
      title: cat.name,
      icon: cat.icon || "",
      columns: (cat as any).columns || [],
      specifications_template: []
    };
  });
  return result;
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
    icon: all[key].icon || "/assets/images/dress.svg",
    columns: all[key].columns,
    specifications_template: all[key].specifications_template
  }));
}
