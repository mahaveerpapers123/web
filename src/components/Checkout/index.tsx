"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";

type CartItem = {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  images?: string[];
};

interface OrderData {
  items: CartItem[];
  total: number;
}

const Checkout = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "production"
      ? "https://mahaveerpapersbe.vercel.app"
      : "http://localhost:5000");

  useEffect(() => {
    const savedOrderData = localStorage.getItem("checkoutOrder");
    if (savedOrderData) {
      const parsedData: OrderData = JSON.parse(savedOrderData);
      setOrder(parsedData);
    }
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

    if (!firstName || !lastName || !email || !line1 || !city || !country || !phone) {
      setMessage("Please fill in your billing details.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const itemsPayload = order.items.map((item) => {
        const priceNum = typeof item.price === "number" ? item.price : Number(item.price || 0);
        const unit_price_minor = Math.round(priceNum * 100);
        const subtotal_minor = Math.round(priceNum * item.quantity * 100);
        return {
          product_id: item.id,
          product_name: item.name,
          unit_price_minor,
          quantity: item.quantity,
          subtotal_minor,
          image_url: item.images?.[0] || ""
        };
      });

      const billing = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        address: {
          line1,
          line2,
          city,
          country,
          phone
        }
      };

      const payload = {
        billing,
        shipping: { address: billing.address },
        payment: { method: paymentMethod },
        items: itemsPayload,
        total: order.total
      };

      /*const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }); */


      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch { }

      if (res.status >= 200 && res.status < 300) {
        setMessage("Order placed successfully!");
        console.log("Order response:", data);
        localStorage.removeItem("checkoutOrder");
        setOrder({ items: [], total: 0 });
        setPaymentMethod("Cash on Delivery");
        form.reset();
        window.dispatchEvent(new CustomEvent("reset-billing-form"));
        window.dispatchEvent(new CustomEvent("reset-shipping-form"));
      } else {
        throw new Error(`Checkout failed (${res.status}): ${data?.message || raw || res.statusText}`);
      }
    } catch (err: any) {
      console.error(err);
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
                  <label htmlFor="notes" className="block mb-2.5">
                    Other Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={5}
                    placeholder="Notes about your order..."
                    className="rounded-md border border-gray-3 bg-gray-1 w-full p-5 outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Your Order</h3>
                  </div>
                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Product</h4>
                      <h4 className="font-medium text-dark text-right">Subtotal</h4>
                    </div>

                    {order?.items?.length ? (
                      order.items.map((item) => {
                        const sub = Number(item.price) * item.quantity;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-5 border-b border-gray-3"
                          >
                            <p className="text-dark">
                              {item.name} <span className="font-semibold">x {item.quantity}</span>
                            </p>
                            <p className="text-dark text-right">₹{sub}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="py-5 text-center text-dark-4">Your order is empty.</p>
                    )}

                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">
                        ₹{order?.total?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                <Coupon />
                <ShippingMethod />
                <PaymentMethod />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md hover:bg-blue-dark mt-7.5"
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
