import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://mahaveerbe.vercel.app";

type SearchParams = {
  query?: string | string[];
  category?: string | string[];
  collection?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function toStr(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v ?? "";
}

async function fetchProducts(filters: { query?: string; category?: string; collection?: string }) {
  // Adjust this path if your backend uses a different endpoint name
  // Expectation: GET /api/products/search?query=&category=&collection=
  const url = new URL(`${API_BASE}/api/products/search`);
  if (filters.query) url.searchParams.set("query", filters.query);
  if (filters.category) url.searchParams.set("category", filters.category);
  if (filters.collection) url.searchParams.set("collection", filters.collection);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ShoppingPage({ searchParams }: Props) {
  const sp = await searchParams; // Next 15 promised props
  const query = toStr(sp.query);
  const category = toStr(sp.category);
  const collection = toStr(sp.collection);

  const products = await fetchProducts({ query, category, collection });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {category
            ? `Category: ${category}`
            : collection
            ? `Collection: ${collection}`
            : query
            ? `Results for "${query}"`
            : "All Products"}
        </h1>
      </div>

      {(!products || products.length === 0) ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <a key={p.id || p.slug} href={`/product/${p.slug}`} className="block">
              <div className="rounded-lg border p-3 hover:shadow-md transition">
                <div className="relative w-full h-40">
                  <Image
                    src={p.thumbnail || p.image || "/images/placeholder.png"}
                    alt={p.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover rounded"
                  />
                </div>
                <div className="mt-2 text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-600">₹{Number(p.price).toFixed(2)}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
