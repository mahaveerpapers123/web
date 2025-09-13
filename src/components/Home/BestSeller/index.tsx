"use client";
import React, { useEffect, useState } from "react";
import SingleItem from "./SingleItem";
import Link from "next/link";
import { shopData } from "@/components/Shop/shopData";
import { Product } from "@/types/product";

const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await shopData(1, 10);
        setProducts(data.items);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">Best Sellers</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {products.slice(1, 7).map((item: Product, key: React.Key) => (
            <div
              key={key}
              className="[&_img:not([src*='icon-star'])]:h-[250px] [&_img:not([src*='icon-star'])]:w-auto [&_img:not([src*='icon-star'])]:object-contain"
            >
              <SingleItem item={item} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shopping"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
