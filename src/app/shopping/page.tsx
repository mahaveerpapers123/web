import Image from "next/image";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://mahaveerbe.vercel.app";

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

async function tryJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function firstImage(p: any): string {
  if (p?.thumbnail) return p.thumbnail;
  if (p?.image) return p.image;
  if (typeof p?.imageUrls === "string" && p.imageUrls.trim()) {
    // CSV or single URL
    const first = p.imageUrls.split(",").map((s: string) => s.trim())[0];
    if (first) return first;
  }
  if (Array.isArray(p?.images) && p.images.length) return p.images[0];
  return "/images/placeholder.png";
}

async function fetchProducts(filters: {
  query?: string;
  category?: string;
  collection?: string;
}) {
  const { query, category, collection } = filters;

  // 1) Preferred: unified search endpoint
  {
    const url = new URL(`${API_BASE}/api/products/search`);
    if (query) url.searchParams.set("query", query);
    if (category) url.searchParams.set("category", category);
    if (collection) url.searchParams.set("collection", collection);
    const data = await tryJson(url.toString());
    if (Array.isArray(data)) return data;
  }

  // 2) Category-only endpoint like /api/products?category=slug
  if (category) {
    const url = new URL(`${API_BASE}/api/products`);
    url.searchParams.set("category", category);
    const data = await tryJson(url.toString());
    if (Array.isArray(data)) return data;
  }

  // 3) Fallback: fetch all, filter locally
  {
    const all = await tryJson(`${API_BASE}/api/products`);
    if (Array.isArray(all)) {
      let out = all;
      if (category) out = out.filter((p) => p?.category_slug === category);
      if (query) {
        const q = query.toLowerCase();
        out = out.filter(
          (p) =>
            p?.name?.toLowerCase().includes(q) ||
            p?.brand?.toLowerCase().includes(q) ||
            p?.model_name?.toLowerCase().includes(q)
        );
      }
      return out;
    }
  }

  return [];
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

      {!products?.length ? (
        <p className="text-gray-600">
          No products found{category ? ` in "${category}"` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <a key={p.id || p.slug} href={`/product/${p.slug}`} className="block">
              <div className="rounded-lg border p-3 hover:shadow-md transition">
                <div className="relative w-full h-40">
                  <Image
                    src={firstImage(p)}
                    alt={p.name || "Product image"}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover rounded"
                  />
                </div>
                <div className="mt-2 text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-600">
                  ₹{Number(p.price).toFixed(2)}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
