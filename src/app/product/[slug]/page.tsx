import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://mahaveerpapersbe.vercel.app";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function getProduct(slug: string) {
  const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getRelated(category?: string, exclude?: string) {
  if (!category) return [];
  const url = new URL(`${API_BASE}/api/products/related`);
  url.searchParams.set("category", category);
  if (exclude) url.searchParams.set("exclude", exclude);
  url.searchParams.set("limit", "8");
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params; // <-- await the promised params in Next 15

  const product = await getProduct(slug);
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">Product not found</h1>
      </div>
    );
  }

  const related = await getRelated(product.category_slug, product.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={product.image || product.thumbnail || "/images/placeholder.png"}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-xl"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.description && <p className="mt-2 text-gray-600">{product.description}</p>}
          <div className="mt-4 text-xl font-medium">₹{Number(product.price).toFixed(2)}</div>
        </div>
      </div>

      {Array.isArray(related) && related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Related products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p: any) => (
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
        </div>
      )}
    </div>
  );
}
