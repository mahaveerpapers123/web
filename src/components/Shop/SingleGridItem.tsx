"use client";
import React from "react";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import Link from "next/link";
import Image from "next/image";

const getUserType = (): "B2B" | "B2C" => {
  try {
    const a = localStorage.getItem("authUser");
    if (a) {
      const p = JSON.parse(a);
      if (p?.type === "B2B") return "B2B";
    }
    const b = localStorage.getItem("user");
    if (b) {
      const p = JSON.parse(b);
      if (p?.type === "B2B") return "B2B";
    }
  } catch {}
  return "B2C";
};

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
    const v = (val as any)?.previews || (val as any)?.thumbnails || (val as any)?.urls || Object.values(val as any);
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
  return arr.map((u) =>
    typeof u === "string" && u.startsWith("http://") ? u.replace("http://", "https://") : u
  );
};

const currency = (n: number | string | null | undefined) => {
  const x = typeof n === "number" ? n : Number(n || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(x);
};

const SingleGridItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userType = React.useMemo(getUserType, []);
  const images = React.useMemo(() => normalizeImages((item as any).images ?? (item as any).imgs), [item]);

  const rawImageUrl = images[0] || "/images/placeholder.png";
  const imageUrl = typeof rawImageUrl === "string" && rawImageUrl.trim() ? rawImageUrl.trim() : "/images/placeholder.png";
  const isRemoteImage = /^https?:\/\//i.test(imageUrl);
  const isDataImage = /^data:image\//i.test(imageUrl);

  const basePrice = Number((item as any).mahaveer_price ?? item.price ?? 0);
  const priceToShow = userType === "B2B" ? ((item as any).b2b_price ?? basePrice) : ((item as any).b2c_price ?? basePrice);
  const showStrike =
    (userType === "B2B" && Number((item as any).b2b_price ?? 0) > 0 && Number((item as any).b2b_price) < basePrice) ||
    (userType === "B2C" && Number((item as any).b2c_price ?? 0) > 0 && Number((item as any).b2c_price) < basePrice);

  const productForDetails = React.useMemo(
    () => ({
      ...item,
      image: imageUrl,
      images,
      imgs: { previews: images, thumbnails: images },
      price: priceToShow,
      mahaveer_price: (item as any).mahaveer_price ?? basePrice,
      mrp: (item as any).mrp ?? "",
      hsn_code: (item as any).hsn_code ?? "",
      hsn_percentage: (item as any).hsn_percentage ?? "",
      weight: (item as any).weight ?? "",
      length: (item as any).length ?? "",
      width: (item as any).width ?? "",
      height: (item as any).height ?? "",
      description: item.description ?? item.name ?? "",
      b2b_price: (item as any).b2b_price,
      b2c_price: (item as any).b2c_price,
    }),
    [item, imageUrl, images, priceToShow, basePrice]
  );

  const handleAddToCart = () => {
    const cartItem = {
      id: String(item.id),
      name: item.name || "",
      price: typeof priceToShow === "number" ? priceToShow : Number(priceToShow || 0),
      image: imageUrl,
      quantity: 1,
    };
    let existingCart: any[] = [];
    try {
      const stored = localStorage.getItem("cartItems");
      existingCart = stored ? JSON.parse(stored) : [];
    } catch {}
    const idx = existingCart.findIndex((i: any) => String(i.id) === String(cartItem.id));
    if (idx !== -1) existingCart[idx].quantity += 1;
    else existingCart.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    dispatch(addItemToCart(cartItem as any));
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleOpenDetails = () => {
    try {
      localStorage.setItem("productDetails", JSON.stringify(productForDetails));
    } catch {}
    dispatch(updateproductDetails(productForDetails as any));
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-white shadow-1 min-h-[270px] mb-4">
        <Image
          src={imageUrl}
          alt={item.name || "Product Image"}
          width={250}
          height={250}
          style={{ objectFit: "contain" }}
          unoptimized={isRemoteImage || isDataImage}
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

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
          <Image src="/images/icons/icon-star.svg" alt="star icon" width={15} height={15} />
        </div>
        <p className="text-custom-sm">({(item as any).reviews ?? 0})</p>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
        <Link href={`/shop-details/${item.id}`} onClick={handleOpenDetails}>
          {item.name}
        </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">{currency(priceToShow)}</span>
        {showStrike ? <span className="text-dark-4 line-through">{currency(basePrice)}</span> : null}
      </span>
    </div>
  );
};

export default SingleGridItem;