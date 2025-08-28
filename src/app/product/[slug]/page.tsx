import React from "react";

const API_BASE = "https://mahaveerbe.vercel.app";

async function getProduct(slug: string) {
  const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function getRelated(categorySlug: string, excludeSlug: string) {
  const url = new URL(`${API_BASE}/api/products/related`);
  url.searchParams.set("category", categorySlug);
  url.searchParams.set("exclude", excludeSlug);
  url.searchParams.set("limit", "8");
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">Product not found</h1>
      </div>
    );
  }

  const categorySlug =
    product.category_slug || product.categoryId || product.category || "";

  const related = categorySlug ? await getRelated(categorySlug, product.slug) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image || product.thumbnail || "/images/placeholder.png"}
          alt={product.name}
          className="w-full rounded-xl object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.description ? (
            <p className="mt-2 text-gray-600">{product.description}</p>
          ) : null}
          <div className="mt-4 text-xl font-medium">
            ₹{Number(product.price).toFixed(2)}
          </div>
        </div>
      </div>

      {Array.isArray(related) && related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Related products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p: any) => (
              <a key={p.id || p.slug} href={`/product/${p.slug}`} className="block">
                <div className="rounded-lg border p-3 hover:shadow-md transition">
                  <img
                    src={p.thumbnail || p.image || "/images/placeholder.png"}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="mt-2 text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-gray-600">
                    ₹{Number(p.price).toFixed(2)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
