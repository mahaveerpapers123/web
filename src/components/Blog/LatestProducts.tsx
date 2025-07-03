// src/components/Blog/LatestProducts.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product"; // Assuming you have a Product type

const LatestProducts = ({ products }: { products: Product[] }) => {
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Latest Products</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* Display a slice of the products */}
          {products.slice(0, 3).map((product) => {
            const imageUrl = product.imgs && product.imgs.thumbnails && product.imgs.thumbnails.length > 0
              ? product.imgs.thumbnails[0]
              : "/images/placeholder.png";
            return (
              <Link
                key={product.id}
                href={`/shop-details/${product.id}`}
                className="flex items-center gap-4 group"
              >
                <div className="max-w-[80px] w-full rounded-[10px] overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    className="rounded-[10px] w-full"
                    width={80}
                    height={80}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h3 className="text-dark leading-[22px] ease-out duration-200 mb-1.5 group-hover:text-blue">
                    {product.name}
                  </h3>
                  <span className="font-semibold text-dark">₹{product.price}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestProducts;