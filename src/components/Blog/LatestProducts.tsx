"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

const imagesToArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    const t = val.trim();
    if (!t) return [];
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    if (t.includes(",")) return t.split(",").map((s) => s.trim()).filter(Boolean);
    return [t];
  }
  if (val && typeof val === "object") {
    const v =
      (val as any)?.thumbnails ||
      (val as any)?.previews ||
      (val as any)?.urls ||
      Object.values(val as any);
    if (Array.isArray(v)) return v.map(String);
  }
  return [];
};

const normalizeImages = (raw: unknown): string[] => {
  const arr = imagesToArray(raw).filter(Boolean);
  if (arr.length >= 2 && /^data:image\/\w+;base64$/i.test(arr[0]) && !arr[0].includes(",")) {
    const merged = `${arr[0]},${arr[1]}`;
    arr.splice(0, 2, merged);
  }
  return arr;
};

const currency = (n: number | string | null | undefined) => {
  const x = typeof n === "number" ? n : Number(n || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(x);
};

const LatestProducts = ({ products }: { products: Product[] }) => {
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Latest Products</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {products.slice(0, 3).map((product) => {
            const imgs = normalizeImages((product as any).images ?? (product as any).imgs);
            const imageUrl = imgs[0] || "/images/placeholder.png";
            return (
              <Link
                key={String(product.id)}
                href={`/shop-details/${product.id}`}
                className="flex items-center gap-4 group"
              >
                <div className="max-w-[80px] w-full rounded-[10px] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name || "Product"}
                    className="rounded-[10px] w-full"
                    width={80}
                    height={80}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div>
                  <h3 className="text-dark leading-[22px] ease-out duration-200 mb-1.5 group-hover:text-blue">
                    {product.name}
                  </h3>
                  <span className="font-semibold text-dark">{currency(product.price)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestProducts;
