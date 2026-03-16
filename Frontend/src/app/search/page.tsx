import AdCard, { AdItem } from "@/components/ui/AdCard";
import { searchDeals } from "@/services/search.service";
import SearchResultsClient from "@/components/SearchResultsClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string | string[];
    category?: string | string[];
    search?: string | string[];
    [key: string]: any;
  };
}) {
  const pickFirst = (v: unknown) => (Array.isArray(v) ? v[0] : v);
  const keys = Object.keys(searchParams || {});
  // consider common keys AND empty-key edge case when URL is like /search?=dress
  const rawQ =
    (pickFirst(searchParams.q) as string | undefined) ??
    (pickFirst(searchParams.search) as string | undefined) ??
    ("" in searchParams ? (pickFirst(searchParams[""]) as string | undefined) : undefined) ??
    (keys.length ? (pickFirst(searchParams[keys[0]]) as string | undefined) : undefined) ??
    "";
  const rawC = (pickFirst(searchParams.category) as string | undefined) ?? "";

  const qRaw = rawQ.trim();
  const cRaw = rawC.trim();
  const hasQuery = Boolean(qRaw) || Boolean(cRaw);

  const res = await searchDeals({ q: qRaw || undefined, sort: "newest", page: 1, limit: 24 });
  const rows: any[] = res.data || [];
  const items: AdItem[] = rows.map((l) => ({
    id: l.id,
    title: l.title,
    price: `₦${Number(l.price).toLocaleString()}`,
    desc: l.description || undefined,
    badge: l.image_url || "/assets/images/bgphone.svg",
    location: l.location || l.city || "Nigeria",
    condition: l.condition || "Brand New",
  }));

  return (
    <SearchResultsClient items={items} query={qRaw} />
  );
}
