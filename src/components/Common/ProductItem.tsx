"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  const handleAddToCart = () => {
    let existingCart: any[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
      existingCart = Array.isArray(stored) ? stored : [];
    } catch {
      existingCart = [];
    }
    const itemIndex = existingCart.findIndex((i: any) => String(i.id) === String(item.id));
    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({
        ...item,
        id: String(item.id),
        name: item.name ?? "",
        quantity: 1,
      });
    }
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleItemToWishList = () => {
    dispatch(
      addItemToWishlist({
        ...item,
        title: item.name ?? "",
        status: "available",
        quantity: 1,
      })
    );
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  const firstFromArray = Array.isArray((item as any).images) ? (item as any).images[0] : undefined;
  const imagesMaybeString = !Array.isArray((item as any).images) ? ((item as any).images as unknown) : undefined;
  const fallbackSingle = typeof imagesMaybeString === "string" ? imagesMaybeString : undefined;
  const imageUrl =
    (typeof firstFromArray === "string" && firstFromArray) ||
    fallbackSingle ||
    (typeof (item as any).image === "string" ? (item as any).image : undefined) ||
    "/images/placeholder.png";

  const priceNumber = typeof (item as any).price === "number" ? (item as any).price : Number((item as any).price || 0);

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4">
        <Image src={imageUrl} alt={item.name ?? "product"} width={250} height={250} style={{ objectFit: "contain" }} />
        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            aria-label="button for quick view"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666ZM2.57964 6.10786C3.66592 4.69661 5.43374 3.16666 8.00016 3.16666C10.5666 3.16666 12.3344 4.69661 13.4207 6.10786C13.7131 6.48772 13.8843 6.7147 13.997 6.9697C14.1023 7.20801 14.1668 7.49929 14.1668 8C14.1668 8.50071 14.1023 8.79199 13.997 9.0303C13.8843 9.28529 13.7131 9.51227 13.4207 9.89213C12.3344 11.3034 10.5666 12.8333 8.00016 12.8333C5.43374 12.8333 3.66592 11.3034 2.57964 9.89213C2.28725 9.51227 2.11599 9.28529 2.00334 9.0303C1.89805 8.79199 1.8335 8.50071 1.8335 8C1.8335 7.49929 1.89805 7.20801 2.00334 6.9697C2.11599 6.7147 2.28725 6.48772 2.57964 6.10786Z"
              />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white hover:bg-blue-dark"
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, idx) => (
            <Image key={idx} src="/images/icons/icon-star.svg" alt="star icon" width={14} height={14} />
          ))}
        </div>
        <p className="text-custom-sm">({(item as any).reviews ?? 0})</p>
      </div>

      <h3 className="font-medium text-dark hover:text-blue mb-1.5" onClick={handleProductDetails}>
        <Link href="/shop-details">{item.name ?? ""}</Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">₹{priceNumber}</span>
        <span className="text-dark-4 line-through">₹{priceNumber ? (priceNumber / 0.8).toFixed(2) : "0.00"}</span>
      </span>
    </div>
  );
};

export default ProductItem;
