"use client";
import { useEffect, useState } from "react";
import { createDeal, deleteDeal, updateDeal } from "@/lib/api";
import { searchDeals } from "@/services/search.service";
import { addFavorite, removeFavorite } from "@/services/favorites.service";

export default function DealsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [page, setPage] = useState(1);

  async function load() {
    try {
      const res = await searchDeals({
        q: q || undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        sort,
        page,
        limit: 12,
      });
      setItems(res.data || []);
      setMeta(res.meta);
    } catch (e: any) {
      setError(e.message || "Failed to load deals");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, minPrice, maxPrice, sort, page]);

  async function onCreate() {
    setError(null);
    if (!title || price === "" || Number.isNaN(Number(price))) {
      setError("Title and price are required");
      return;
    }
    setLoading(true);
    try {
      await createDeal({ title, description, price: Number(price) });
      setTitle("");
      setDescription("");
      setPrice("");
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to create deal");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate(id: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newTitle = prompt("Title", item.title) ?? item.title;
    const newDesc = prompt("Description", item.description || "") ?? item.description;
    const newPriceStr = prompt("Price", String(item.price)) ?? String(item.price);
    const newPrice = Number(newPriceStr);
    if (Number.isNaN(newPrice)) return;
    try {
      await updateDeal(id, { title: newTitle, description: newDesc, price: newPrice });
      await load();
    } catch (e: any) {
      alert(e.message || "Failed to update deal");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this deal?")) return;
    try {
      await deleteDeal(id);
      await load();
    } catch (e: any) {
      alert(e.message || "Failed to delete deal");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Deals</h1>
      <div className="border rounded p-4 mb-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input
          className="border rounded px-3 py-2 sm:col-span-2"
          placeholder="Search"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => {
            setPage(1);
            setMinPrice(e.target.value);
          }}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => {
            setPage(1);
            setMaxPrice(e.target.value);
          }}
        />
        <select
          className="border rounded px-3 py-2"
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value as any);
          }}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div className="border rounded p-4 mb-6">
        <h2 className="font-semibold mb-3">Create Deal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value as any)}
          />
        </div>
        <button
          onClick={onCreate}
          disabled={loading}
          className="mt-3 bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <ul className="space-y-3">
        {items.map((d) => (
          <li key={d.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{d.title}</div>
              <div className="text-sm text-gray-600">{d.description}</div>
              <div className="text-sm">₦{d.price}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    await addFavorite(d.id);
                  } catch (e: any) {
                    alert(e.message || "Failed to save favorite");
                  }
                }}
                className="px-3 py-1 rounded border"
              >
                Save
              </button>
              <button
                onClick={() => onUpdate(d.id)}
                className="px-3 py-1 rounded border"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(d.id)}
                className="px-3 py-1 rounded border text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {meta.page} of {meta.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page >= meta.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
