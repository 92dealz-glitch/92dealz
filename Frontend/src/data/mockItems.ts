import type { AdItem } from "../components/ui/AdCard";

const items: (AdItem & { category: string })[] = [];

export async function getItemsByCategory(category: string) {
  // simple filter now; replace with API call later
  return items.filter((it) => it.category === category);
}

export async function getAllItems() {
  return items;
}

export default items;


