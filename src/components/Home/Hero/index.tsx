"use client";
import React, { useState } from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = () => {
  const [products] = useState([
    {
      title: "Graphite Drawing Pencils",
      offer: "limited time offer",
      price: "₹99.99",
      originalPrice: "₹299.99",
      image: "/images/ecommerce/graphite-drawing-pencils.png",
    },
    {
      title: "Essential School Tools Set",
      offer: "limited time offer",
      price: "₹199.99",
      originalPrice: "₹399.99",
      image: "/images/ecommerce/school-tool.png",
    },
  ]);

  const displayedProducts = products.slice(0, 3);
  const productCount = displayedProducts.length;

  const heightClass =
    productCount === 1
      ? "h-full"
      : productCount === 2
      ? "h-1/2"
      : "h-1/3";

  return (
    <section
      className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-17.5 bg-[#E5EAF4] mt-0 lg:mt-0"
    >

      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />
              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full flex flex-col gap-5">
            {displayedProducts.map((product, index) => (
              <div
                key={index}
                className={`relative rounded-[10px] bg-white p-4 sm:p-7.5 ${heightClass}`}
              >
                <div className="flex items-center justify-between gap-6 h-full">
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="font-semibold text-dark text-xl mb-4">
                      <a href="#">{product.title}</a>
                    </h2>
                    <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                      {product.offer}
                    </p>
                    <span className="flex items-center gap-3">
                      <span className="font-medium text-heading-5 text-red">
                        {product.price}
                      </span>
                      <span className="font-medium text-2xl text-dark-4 line-through">
                        {product.originalPrice}
                      </span>
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={150}
                      height={180}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HeroFeature />
    </section>
  );
};

export default Hero;
