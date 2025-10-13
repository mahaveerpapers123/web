"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { shopData } from "@/components/Shop/shopData";

const NewArrival = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await shopData(1, 10);
        if (!mounted) return;
        const items = Array.isArray(res?.items) ? res.items : [];
        setProducts(items);
      } catch (e: any) {
        setErr(e?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">New Arrivals</h2>
          </div>
          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        {loading && <div className="py-10">Loading…</div>}
        {err && !loading && <div className="py-6 text-red-600">{err}</div>}

        {!loading && !err && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
            {products.map((item: any) => (
              <div
                key={item.id ?? `${item.brand}-${item.name}`}
                className="h-full [&_img:not([src*='icon-star'])]:h-[250px] [&_img:not([src*='icon-star'])]:w-auto [&_img:not([src*='icon-star'])]:object-contain"
              >
                <ProductItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Link
          href="/shop-with-sidebar"
          className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
        >
          View All
        </Link>
      </div>
    </section>
  );
};

export default NewArrival;
