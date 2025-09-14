// src/components/ShopWithoutSidebar/index.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import SingleListItem from "@/components/Shop/SingleListItem";
import { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://mahaveerpapersbe.vercel.app";

type ApiProduct = any;

const normalizeItem = (p: ApiProduct): Product & { imgs?: { previews?: string[]; thumbnails?: string[] } } => {
  const thumbs = p?.imgs?.thumbnails ?? [];
  const prevs = p?.imgs?.previews ?? [];
  const images = Array.isArray(p?.images) ? p.images : [];
  const merged = [...thumbs, ...prevs, ...images].filter(Boolean);
  const https = merged.map((u: string) =>
    typeof u === "string" && u.startsWith("http://") ? u.replace("http://", "https://") : u
  );
  return {
    ...p,
    images: https,
    imgs: { thumbnails: https, previews: https },
  };
};

function coerceArray(json: any): ApiProduct[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.items)) return json.items;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.results)) return json.results;
  if (json && typeof json === "object" && Object.keys(json).length) return [json];
  return [];
}

export default function ShopWithoutSidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const pageSize = 12;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setErr(null);
      try {
        const url = category
          ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
          : `${API_BASE}/api/products`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
        const json = await res.json();
        const arr = coerceArray(json);
        if (!cancelled) {
          const normalized = arr.map(normalizeItem);
          setAllProducts(normalized);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const total = allProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, pageParam), totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allProducts.slice(start, start + pageSize);
  }, [allProducts, page]);

  const handlePageChange = (p: number) => {
    if (p < 1 || p > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    if (category) params.set("category", category);
    router.push(`/shopping?${params.toString()}`);
  };

  const pageNumbers = useMemo(() => {
    const arr: (number | string)[] = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) arr.push(i);
    }
    const out: (number | string)[] = [];
    let last: number | null = null;
    for (const n of arr) {
      if (typeof n === "number") {
        if (last !== null && n - last > 1) out.push("...");
        out.push(n);
        last = n;
      }
    }
    return out;
  }, [page, totalPages]);

  const title = category ? category.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Explore All Products";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {err}</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title={title} pages={["shop", "/", "shop without sidebar"]} />
      <section
        className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]"
        style={{ background: "linear-gradient(to right, #ccfbf1, #dcfce7, #fef9c3, #fecaca)" }}
      >
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            <div className="w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <p>
                      Showing <span className="text-dark">{pageItems.length}</span> of{" "}
                      <span className="text-dark">{total}</span> Products
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setView("grid")}
                      aria-label="grid"
                      className={`${
                        view === "grid" ? "bg-blue border-blue text-white" : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4.836 1.3125C4.16215 1.31248 3.60022 1.31246 3.15414 1.37244C2.6833 1.43574 2.2582 1.57499 1.91659 1.91659C1.57499 2.2582 1.43574 2.6833 1.37244 3.15414C1.31246 3.60022 1.31248 4.16213 1.3125 4.83598V4.914C1.31248 5.58785 1.31246 6.14978 1.37244 6.59586C1.43574 7.06671 1.57499 7.49181 1.91659 7.83341C2.2582 8.17501 2.6833 8.31427 3.15414 8.37757C3.60022 8.43754 4.16213 8.43752 4.83598 8.4375H4.914C5.58785 8.43752 6.14978 8.43754 6.59586 8.37757C7.06671 8.31427 7.49181 8.17501 7.83341 7.83341C8.17501 7.49181 8.31427 7.06671 8.37757 6.59586C8.43754 6.14978 8.43752 5.58787 8.4375 4.91402V4.83601C8.43752 4.16216 8.43754 3.60022 8.37757 3.15414C8.31427 2.6833 8.17501 2.2582 7.83341 1.91659C7.49181 1.57499 7.06671 1.43574 6.59586 1.37244C6.14979 1.31246 5.58789 1.31248 4.91405 1.3125H4.83601Z" />
                        <path d="M13.086 9.5625C12.4121 9.56248 11.8502 9.56246 11.4041 9.62244C10.9333 9.68574 10.5082 9.82499 10.1666 10.1666C9.82499 10.5082 9.68574 10.9333 9.62244 11.4041C9.56246 11.8502 9.56248 12.4121 9.5625 13.086V13.164C9.56248 13.8378 9.56246 14.3998 9.62244 14.8459C9.68574 15.3167 9.82499 15.7418 10.1666 16.0834C10.5082 16.425 10.9333 16.5643 11.4041 16.6276C11.8502 16.6875 12.4121 16.6875 13.0859 16.6875H13.164C13.8378 16.6875 14.3998 16.6875 14.8459 16.6276C15.3167 16.5643 15.7418 16.425 16.0834 16.0834C16.425 15.7418 16.5643 15.3167 16.6276 14.8459C16.6875 14.3998 16.6875 13.8379 16.6875 13.1641V13.086C16.6875 12.4122 16.6875 11.8502 16.6276 11.4041C16.5643 10.9333 16.425 10.5082 16.0834 10.1666C15.7418 9.82499 15.3167 9.68574 14.8459 9.62244C14.3998 9.56246 13.8379 9.56248 13.164 9.5625H13.086Z" />
                        <path d="M4.836 9.5625H4.914C5.58786 9.56248 6.14978 9.56246 6.59586 9.62244C7.06671 9.68574 7.49181 9.82499 7.83341 10.1666C8.17501 10.5082 8.31427 10.9333 8.37757 11.4041C8.43754 11.8502 8.43752 12.4121 8.4375 13.086V13.164C8.43752 13.8378 8.43754 14.3998 8.37757 14.8459C8.31427 15.3167 8.17501 15.7418 7.83341 16.0834C7.49181 16.425 7.06671 16.5643 6.59586 16.6276C6.14979 16.6875 5.58789 16.6875 4.91405 16.6875H4.83601C4.16217 16.6875 3.60022 16.6875 3.15414 16.6276C2.6833 16.5643 2.2582 16.425 1.91659 16.0834C1.57499 15.7418 1.43574 15.3167 1.37244 14.8459C1.31246 14.3998 1.31248 13.8379 1.3125 13.164V13.086C1.31248 12.4122 1.31246 11.8502 1.37244 11.4041C1.43574 10.9333 1.57499 10.5082 1.91659 10.1666C2.2582 9.82499 2.6833 9.68574 3.15414 9.62244C3.60023 9.56246 4.16214 9.56248 4.836 9.5625Z" />
                        <path d="M13.086 1.3125C12.4122 1.31248 11.8502 1.31246 11.4041 1.37244C10.9333 1.43574 10.5082 1.57499 10.1666 1.91659C9.82499 2.2582 9.68574 2.6833 9.62244 3.15414C9.56246 3.60023 9.56248 4.16214 9.5625 4.836V4.914C9.56248 5.58786 9.56246 6.14978 9.62244 6.59586C9.68574 7.06671 9.82499 7.49181 10.1666 7.83341C10.5082 8.17501 10.9333 8.31427 11.4041 8.37757C11.8502 8.43754 12.4121 8.43752 13.086 8.4375H13.164C13.8378 8.43752 14.3998 8.43754 14.8459 8.37757C15.3167 8.31427 15.7418 8.17501 16.0834 7.83341C16.425 7.49181 16.5643 7.06671 16.6276 6.59586C16.6875 6.14978 16.6875 5.58787 16.6875 4.91402V4.83601C16.6875 4.16216 16.6875 3.60022 16.6276 3.15414C16.5643 2.6833 16.425 2.2582 16.0834 1.91659C15.7418 1.57499 15.3167 1.43574 14.8459 1.37244C14.3998 1.31246 13.8379 1.31248 13.164 1.3125H13.086Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setView("list")}
                      aria-label="list"
                      className={`${
                        view === "list" ? "bg-blue border-blue text-white" : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4.4234 0.899903C3.74955 0.899882 3.18763 0.899864 2.74155 0.959838C2.2707 1.02314 1.8456 1.16239 1.504 1.504C1.16239 1.8456 1.02314 2.2707 0.959838 2.74155C0.899864 3.18763 0.899882 3.74953 0.899903 4.42338V4.5014C0.899882 5.17525 0.899864 5.73718 0.959838 6.18326C1.02314 6.65411 1.16239 7.07921 1.504 7.42081C1.8456 7.76241 2.2707 7.90167 2.74155 7.96497C3.18763 8.02495 3.74953 8.02493 4.42339 8.02491H4.5014C5.17525 8.02493 14.7372 8.02495 15.1833 7.96497C15.6541 7.90167 16.0792 7.76241 16.4208 7.42081C16.7624 7.07921 16.9017 6.65411 16.965 6.18326C17.0249 5.73718 17.0249 5.17527 17.0249 4.50142V4.42341C17.0249 3.74956 17.0249 3.18763 16.965 2.74155C16.9017 2.2707 16.7624 1.8456 16.4208 1.504C16.0792 1.16239 15.6541 1.02314 15.1833 0.959838C14.7372 0.899864 5.17528 0.899882 4.50142 0.899903H4.4234Z" />
                        <path d="M4.4234 9.1499H4.5014C5.17526 9.14988 14.7372 9.14986 15.1833 9.20984C15.6541 9.27314 16.0792 9.41239 16.4208 9.754C16.7624 10.0956 16.9017 10.5207 16.965 10.9915C17.0249 11.4376 17.0249 11.9995 17.0249 12.6734V12.7514C17.0249 13.4253 17.0249 13.9872 16.965 14.4333C16.9017 14.9041 16.7624 15.3292 16.4208 15.6708C16.0792 16.0124 15.6541 16.1517 15.1833 16.215C14.7372 16.2749 5.17529 16.2749 4.50145 16.2749H4.42341C3.74957 16.2749 3.18762 16.2749 2.74155 16.215C2.2707 16.1517 1.8456 16.0124 1.504 15.6708C1.16239 15.3292 1.02314 14.9041 0.959838 14.4333C0.899864 13.9872 0.899882 13.4253 0.899903 12.7514V12.6734C0.899882 11.9996 0.899864 11.4376 0.959838 10.9915C1.02314 10.5207 1.16239 10.0956 1.504 9.754C1.8456 9.41239 2.2707 9.27314 2.74155 9.20984C3.18763 9.14986 3.74955 9.14988 4.4234 9.1499Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {pageItems.length > 0 ? (
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch auto-rows-fr"
                      : "flex flex-col gap-7.5"
                  }
                >
                  {pageItems.map((item) =>
                    view === "grid" ? (
                      <div
                        key={item.id}
                        className="h-full [&_img:not([src*='icon-star'])]:h-[250px] [&_img:not([src*='icon-star'])]:w-auto [&_img:not([src*='icon-star'])]:object-contain"
                      >
                        <SingleGridItem item={item} />
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        className="[&_img:not([src*='icon-star'])]:h-[250px] [&_img:not([src*='icon-star'])]:w-auto [&_img:not([src*='icon-star'])]:object-contain"
                      >
                        <SingleListItem item={item} />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg">
                  <h2 className="text-2xl font-semibold">No Products Found</h2>
                  <p className="mt-2 text-gray-600">Try a different search or category.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-15">
                  <div className="bg-white shadow-1 rounded-md p-2">
                    <ul className="flex items-center">
                      <li>
                        <button
                          aria-label="Previous page"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 hover:bg-blue hover:text-white"
                        >
                          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z" />
                          </svg>
                        </button>
                      </li>
                      {pageNumbers.map((p, i) => (
                        <li key={i}>
                          {p === "..." ? (
                            <span className="flex py-1.5 px-3.5">...</span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(p as number)}
                              className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                                page === p ? "bg-blue text-white" : "hover:text-white hover:bg-blue"
                              }`}
                            >
                              {p}
                            </button>
                          )}
                        </li>
                      ))}
                      <li>
                        <button
                          aria-label="Next page"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                          className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4 hover:text-white hover:bg-blue"
                        >
                          <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z" />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
