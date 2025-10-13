"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Shipping from "./Shipping";
import Coupon from "./Coupon";
import Billing from "./Billing";
import Image from "next/image";

type CartItem = {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
  images?: string[];
  imgs?: { thumbnails?: string[]; previews?: string[]; urls?: string[] };
  hsn_percentage?: number | string;
  mrp?: number | string;
  mahaveer_price?: number | string;
  height?: number | string;
  width?: number | string;
  length?: number | string;
  weight?: number | string;
};

interface OrderData {
  items: CartItem[];
  total: number;
}

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
  return arr.map((u) => (typeof u === "string" && u.startsWith("http://") ? u.replace("http://", "https://") : u));
};

const primaryImage = (item: CartItem): string => {
  const fromSingular = item.image ? [item.image] : [];
  const fromArray = item.images ? item.images : [];
  const fromImgs = normalizeImages(item.imgs || {});
  const all = normalizeImages([...fromSingular, ...fromArray, ...fromImgs]);
  return all[0] || "/images/placeholder.png";
};

const fmtMoney = (v: number | string | undefined) => {
  const n = Number(v);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );
};

const fmtNum = (v: number | string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n === 0) return "-";
  return `${n}`;
};

const fmtPct = (v: number | string | undefined) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return `${n}%`;
};

const Checkout = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "production" ? "https://mahaveerpapersbe.vercel.app" : "http://localhost:5000");

  useEffect(() => {
    const saved = localStorage.getItem("checkoutOrder");
    const cartRaw = localStorage.getItem("cartItems");
    let orderData: OrderData | null = saved ? JSON.parse(saved) : null;
    const cartArr: CartItem[] = cartRaw ? JSON.parse(cartRaw) : [];
    const cartMap = new Map<string, CartItem>();
    for (const c of cartArr) cartMap.set(String(c.id), c);
    if (orderData) {
      const enrichedItems = orderData.items.map((it) => {
        const id = String(it.id);
        const inCart = cartMap.get(id);
        if (!inCart) return it;
        const merged: CartItem = {
          ...it,
          image: it.image || inCart.image,
          images: it.images?.length ? it.images : inCart.images,
          imgs: it.imgs || inCart.imgs,
          hsn_percentage: it.hsn_percentage ?? inCart.hsn_percentage,
          mrp: it.mrp ?? inCart.mrp,
          mahaveer_price: it.mahaveer_price ?? inCart.mahaveer_price ?? it.price,
          height: it.height ?? inCart.height,
          width: it.width ?? inCart.width,
          length: it.length ?? inCart.length,
          weight: it.weight ?? inCart.weight,
        };
        return merged;
      });
      orderData = { ...orderData, items: enrichedItems };
    }
    setOrder(orderData);
  }, []);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order || order.items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const line1 = String(fd.get("address") || "").trim();
    const line2 = String(fd.get("addressTwo") || "").trim();
    const city = String(fd.get("town") || "").trim();
    const countrySelect = String(fd.get("countryName") || "").trim();
    const countryText = String(fd.get("country") || "").trim();
    const country = countrySelect || countryText;
    const phone = String(fd.get("phone") || "").trim();
    const notes = String(fd.get("notes") || "").trim();

    if (!firstName || !lastName || !email || !line1 || !city || !country || !phone) {
      setMessage("Please fill in your billing details.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const itemsPayload = order.items.map((item) => {
        const basePrice = item.mahaveer_price ?? item.price;
        const priceNum = typeof basePrice === "number" ? basePrice : Number(basePrice || 0);
        const unit_price_minor = Math.round(priceNum * 100);
        const subtotal_minor = Math.round(priceNum * item.quantity * 100);
        return {
          product_id: item.id,
          product_name: item.name,
          unit_price_minor,
          quantity: item.quantity,
          subtotal_minor,
          image_url: primaryImage(item),
          hsn_percentage: item.hsn_percentage ?? null,
          mrp: item.mrp ?? null,
          mahaveer_price: item.mahaveer_price ?? null,
          height: item.height ?? null,
          width: item.width ?? null,
          length: item.length ?? null,
          weight: item.weight ?? null,
        };
      });

      const billing = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        address: { line1, line2, city, country, phone },
      };

      const payload = {
        billing,
        shipping: { address: billing.address },
        payment: { method: paymentMethod },
        items: itemsPayload,
        total: order.total,
        notes: notes || undefined,
      };

      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {}

      if (res.status >= 200 && res.status < 300) {
        setMessage("Order placed successfully!");
        localStorage.removeItem("checkoutOrder");
        setOrder({ items: [], total: 0 });
        setPaymentMethod("Cash on Delivery");
        form.reset();
        window.dispatchEvent(new CustomEvent("reset-billing-form"));
        window.dispatchEvent(new CustomEvent("reset-shipping-form"));
      } else {
        throw new Error(`Checkout failed (${res.status}): ${data?.message || raw || res.statusText}`);
      }
    } catch {
      setMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleCheckout}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              <div className="lg:max-w-[670px] w-full">
                <Billing />
                <Shipping />
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <label htmlFor="notes" className="block mb-2.5">Other Notes (optional)</label>
                  <textarea name="notes" id="notes" rows={5} placeholder="Notes about your order..." className="rounded-md border border-gray-3 bg-gray-1 w-full p-5 outline-none" />
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Your Order</h3>
                  </div>
                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="grid grid-cols-12 items-center py-5 border-b border-gray-3">
                      <h4 className="col-span-8 font-medium text-dark">Product</h4>
                      <h4 className="col-span-4 font-medium text-dark text-right">Subtotal</h4>
                    </div>

                    {order?.items?.length ? (
                      order.items.map((item) => {
                        const basePrice = item.mahaveer_price ?? item.price;
                        const priceNum = typeof basePrice === "number" ? basePrice : Number(basePrice || 0);
                        const sub = priceNum * item.quantity;
                        const img = primaryImage(item);
                        return (
                          <div key={item.id} className="py-5 border-b border-gray-3 space-y-3">
                            <div className="flex gap-3 items-center">
                              <div className="h-14 w-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                <Image src={img} alt={item.name || "Product"} width={56} height={56} className="object-contain h-full w-full" />
                              </div>
                              <div className="flex-1">
                                <p className="text-dark leading-tight">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-dark text-right">{fmtMoney(sub)}</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3">
                              <div><span className="block text-gray-500">HSN %</span><span className="font-medium">{fmtPct(item.hsn_percentage)}</span></div>
                              <div><span className="block text-gray-500">MRP</span><span className="font-medium">{fmtMoney(item.mrp)}</span></div>
                              <div><span className="block text-gray-500">Mahaveer</span><span className="font-medium">{fmtMoney(item.mahaveer_price ?? item.price)}</span></div>
                              <div><span className="block text-gray-500">Length</span><span className="font-medium">{fmtNum(item.length)}</span></div>
                              <div><span className="block text-gray-500">Width</span><span className="font-medium">{fmtNum(item.width)}</span></div>
                              <div><span className="block text-gray-500">Height</span><span className="font-medium">{fmtNum(item.height)}</span></div>
                              <div className="col-span-2 sm:col-span-3"><span className="block text-gray-500">Weight</span><span className="font-medium">{fmtNum(item.weight)}</span></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="py-5 text-center text-dark-4">Your order is empty.</p>
                    )}

                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">{fmtMoney(order?.total ?? 0)}</p>
                    </div>
                  </div>
                </div>

                <Coupon />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md hover:bg-blue-dark mt-7.5 disabled:opacity-70"
                >
                  {loading ? "Placing Order..." : "Process to Checkout"}
                </button>

                {message && <p className="mt-4 text-center">{message}</p>}
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
