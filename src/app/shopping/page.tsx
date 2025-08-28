"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = "https://mahaveerbe.vercel.app";

type Product = {
  id: string;
  slug: string;
  name: string;
  thumbnail?: string;
  image?: string;
  price: number;
  category_slug?: string;
};

export default function ShoppingPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const collection = searchParams.get("collection");
  const query = searchParams.get("query");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL(`${API_BASE}/api/products/search`);
        if (category) url.searchParams.set("category", category);
        if (collection) url.searchParams.set("collection", collection);
        if (query) url.searchParams.set("q", query);
        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json();
        const list: Product[] = Array.isArray(data) ? data : data?.items || [];
        setProducts(list);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, collection, query]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8">Loading…</div>;
  if (!products.length) return <div className="max-w-6xl mx-auto px-4 py-8">No products found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <a key={p.id} href={`/product/${p.slug}`} className="block">
            <div className="rounded-lg border p-4 hover:shadow-md transition">
              <img
                src={p.thumbnail || p.image || "/images/placeholder.png"}
                alt={p.name}
                className="w-full h-48 object-cover rounded"
              />
              <div className="mt-2 font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">₹{Number(p.price).toFixed(2)}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
