"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";

const SingleListItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  // Determine the image URL with fallbacks
  const imageUrl =
    item?.imgs?.thumbnails?.[0] ||
    item?.imgs?.previews?.[0] ||
    "/images/placeholder.png";

  // update QuickView
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart (with localStorage sync)
  const handleAddToCart = () => {
    const newItem = {
      ...item,
      id: String(item.id),
      name: item.name ?? "",
      quantity: 1,
    };

    // Get existing cart from localStorage
    let existingCart: any[] = [];
    try {
      const stored = localStorage.getItem("cartItems");
      existingCart = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing cartItems:", error);
    }

    // If item exists, increase quantity, else add new
    const existingIndex = existingCart.findIndex((i) => i.id === newItem.id);
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(newItem);
    }

    // Save back to localStorage
    localStorage.setItem("cartItems", JSON.stringify(existingCart));

    // Dispatch to Redux
    dispatch(addItemToCart(newItem));

    // Fire event so UI can update
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  return (
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex">
        {/* Image section */}
        <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4">
          <Image
            src={imageUrl}
            alt={item.name || "Product image"}
            width={250}
            height={250}
            style={{ objectFit: "contain" }}
          />

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
            >
              Add to cart
            </button>
          </div>
        </div>

        {/* Details section */}
        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
              <Link href="/shop-details">{item.name}</Link>
            </h3>

            <span className="flex items-center gap-2 font-medium text-lg">
              <span className="text-dark">${item.discountedPrice}</span>
              <span className="text-dark-4 line-through">${item.price}</span>
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex items-center gap-1">
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <Image
                    key={idx}
                    src="/images/icons/icon-star.svg"
                    alt="star icon"
                    width={15}
                    height={15}
                  />
                ))}
            </div>
            <p className="text-custom-sm">({item.reviews})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
