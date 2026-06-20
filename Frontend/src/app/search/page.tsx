import { AdItem } from "@/components/ui/AdCard";
import { searchDeals } from "@/services/search.service";
import SearchResultsClient from "@/components/SearchResultsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pickFirst = (v: unknown) => (Array.isArray(v) ? v[0] : v);
  const resolvedSearchParams = (await searchParams) || {};
  const keys = Object.keys(resolvedSearchParams);
  
  const rawQ =
    (pickFirst(resolvedSearchParams.q) as string | undefined) ??
    (pickFirst(resolvedSearchParams.search) as string | undefined) ??
    ("" in resolvedSearchParams ? (pickFirst(resolvedSearchParams[""]) as string | undefined) : undefined) ??
    (keys.length ? (pickFirst(resolvedSearchParams[keys[0]]) as string | undefined) : undefined) ??
    "";
  const rawC = (pickFirst(resolvedSearchParams.category) as string | undefined) ?? "";
  const userId = (pickFirst(resolvedSearchParams.userId) as string | undefined);

  const qRaw = rawQ.trim();
  const cRaw = rawC.trim();

  const res = await searchDeals({ 
    q: qRaw || undefined, 
    userId: userId || undefined,
    sort: "newest", 
    page: 1, 
    limit: 24 
  });
  
  const rows: any[] = res.data || [];
  const items: AdItem[] = rows.map((l) => ({
    id: l.id,
    title: l.title,
    price: `₦${Number(l.price).toLocaleString()}`,
    priceValue: Number(l.price),
    desc: l.description || undefined,
    badge: l.image_url || "/assets/images/bgphone.svg",
    location: l.location || "Pakistan",
    state: l.state,
    city: l.city,
    condition: l.condition || "New",
    rating: l.rating,
    isVerified: l.is_verified || l.User?.is_verified || false,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <SearchResultsClient items={items} query={qRaw} />
      </main>
      <Footer />
    </div>
  );
}


