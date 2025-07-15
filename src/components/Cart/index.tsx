/* eslint-disable @next/next/no-img-element */
// "use client";
// import React from "react";
// import Discount from "./Discount";
// import OrderSummary from "./OrderSummary";
// import { useAppSelector } from "@/redux/store";
// import SingleItem from "./SingleItem";
// import Breadcrumb from "../Common/Breadcrumb";
// import Link from "next/link";

// const Cart = () => {
//   const cartItems = useAppSelector((state) => state.cartReducer.items);

//   return (
//     <>
//       {/* <!-- ===== Breadcrumb Section Start ===== --> */}
//       <section>
//         <Breadcrumb title={"Cart"} pages={["Cart"]} />
//       </section>
//       {/* <!-- ===== Breadcrumb Section End ===== --> */}
//       {cartItems.length > 0 ? (
//         <section className="overflow-hidden py-20">
//           <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
//             <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
//               <h2 className="font-medium text-dark text-2xl">Your Cart</h2>
//               <button className="text-blue">Clear Shopping Cart</button>
//             </div>

//             <div className="rounded-[10px] shadow-1">
//               <div className="w-full overflow-x-auto">
//                 <div className="min-w-[1170px]">
//                   {/* <!-- table header --> */}
//                   <div className="flex items-center py-5.5 px-7.5">
//                     <div className="min-w-[400px]">
//                       <p className="text-dark">Product</p>
//                     </div>

//                     <div className="min-w-[180px]">
//                       <p className="text-dark">Price</p>
//                     </div>

//                     <div className="min-w-[275px]">
//                       <p className="text-dark">Quantity</p>
//                     </div>

//                     <div className="min-w-[200px]">
//                       <p className="text-dark">Subtotal</p>
//                     </div>

//                     <div className="min-w-[50px]">
//                       <p className="text-dark text-right">Action</p>
//                     </div>
//                   </div>

//                   {/* <!-- cart item --> */}
//                   {cartItems.length > 0 &&
//                     cartItems.map((item, key) => (
//                       <SingleItem item={item} key={key} />
//                     ))}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
//               <Discount />
//               <OrderSummary />
//             </div>
//           </div>
//         </section>
//       ) : (
//         <>
//           <div className="text-center mt-8">
//             <div className="mx-auto pb-7.5">
//               <svg
//                 className="mx-auto"
//                 width="100"
//                 height="100"
//                 viewBox="0 0 100 100"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <circle cx="50" cy="50" r="50" fill="#F3F4F6" />
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M36.1693 36.2421C35.6126 36.0565 35.0109 36.3574 34.8253 36.9141C34.6398 37.4707 34.9406 38.0725 35.4973 38.258L35.8726 38.3831C36.8308 38.7025 37.4644 38.9154 37.9311 39.1325C38.373 39.3381 38.5641 39.5036 38.6865 39.6734C38.809 39.8433 38.9055 40.0769 38.9608 40.5612C39.0192 41.0726 39.0208 41.7409 39.0208 42.751L39.0208 46.5361C39.0208 48.4735 39.0207 50.0352 39.1859 51.2634C39.3573 52.5385 39.7241 53.6122 40.5768 54.4649C41.4295 55.3176 42.5032 55.6844 43.7783 55.8558C45.0065 56.0209 46.5681 56.0209 48.5055 56.0209H59.9166C60.5034 56.0209 60.9791 55.5452 60.9791 54.9584C60.9791 54.3716 60.5034 53.8959 59.9166 53.8959H48.5833C46.5498 53.8959 45.1315 53.8936 44.0615 53.7498C43.022 53.61 42.4715 53.3544 42.0794 52.9623C41.9424 52.8253 41.8221 52.669 41.7175 52.4792H55.7495C56.3846 52.4792 56.9433 52.4793 57.4072 52.4292C57.9093 52.375 58.3957 52.2546 58.8534 51.9528C59.3111 51.651 59.6135 51.2513 59.8611 50.8111C60.0898 50.4045 60.3099 49.891 60.56 49.3072L61.2214 47.7641C61.766 46.4933 62.2217 45.4302 62.4498 44.5655C62.6878 43.6634 62.7497 42.7216 62.1884 41.8704C61.627 41.0191 60.737 40.705 59.8141 40.5684C58.9295 40.4374 57.7729 40.4375 56.3903 40.4375L41.0845 40.4375C41.0806 40.3979 41.0765 40.3588 41.0721 40.3201C40.9937 39.6333 40.8228 39.0031 40.4104 38.4309C39.998 37.8588 39.4542 37.4974 38.8274 37.2058C38.2377 36.9315 37.4879 36.6816 36.6005 36.3858L36.1693 36.2421ZM41.1458 42.5625C41.1458 42.6054 41.1458 42.6485 41.1458 42.692L41.1458 46.4584C41.1458 48.1187 41.1473 49.3688 41.2262 50.3542H55.6975C56.4 50.3542 56.8429 50.3528 57.1791 50.3165C57.4896 50.2829 57.6091 50.2279 57.6836 50.1787C57.7582 50.1296 57.8559 50.0415 58.009 49.7692C58.1748 49.4745 58.3506 49.068 58.6273 48.4223L59.2344 47.0057C59.8217 45.6355 60.2119 44.7177 60.3951 44.0235C60.5731 43.3488 60.4829 43.1441 60.4143 43.0401C60.3458 42.9362 60.1931 42.7727 59.5029 42.6705C58.7927 42.5653 57.7954 42.5625 56.3047 42.5625H41.1458Z"
//                   fill="#8D93A5"
//                 />
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M40.4375 60.625C40.4375 62.3855 41.8646 63.8125 43.625 63.8125C45.3854 63.8125 46.8125 62.3855 46.8125 60.625C46.8125 58.8646 45.3854 57.4375 43.625 57.4375C41.8646 57.4375 40.4375 58.8646 40.4375 60.625ZM43.625 61.6875C43.0382 61.6875 42.5625 61.2118 42.5625 60.625C42.5625 60.0382 43.0382 59.5625 43.625 59.5625C44.2118 59.5625 44.6875 60.0382 44.6875 60.625C44.6875 61.2118 44.2118 61.6875 43.625 61.6875Z"
//                   fill="#8D93A5"
//                 />
//                 <path
//                   fill-rule="evenodd"
//                   clip-rule="evenodd"
//                   d="M56.375 63.8126C54.6146 63.8126 53.1875 62.3856 53.1875 60.6251C53.1875 58.8647 54.6146 57.4376 56.375 57.4376C58.1354 57.4376 59.5625 58.8647 59.5625 60.6251C59.5625 62.3856 58.1354 63.8126 56.375 63.8126ZM55.3125 60.6251C55.3125 61.212 55.7882 61.6876 56.375 61.6876C56.9618 61.6876 57.4375 61.212 57.4375 60.6251C57.4375 60.0383 56.9618 59.5626 56.375 59.5626C55.7882 59.5626 55.3125 60.0383 55.3125 60.6251Z"
//                   fill="#8D93A5"
//                 />
//               </svg>
//             </div>

//             <p className="pb-6">Your cart is empty!</p>

//             <Link
//               href="/shop-with-sidebar"
//               className="w-96 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Cart;


"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  images?: string[];
  model_name?: string;
}


const SingleItem = ({ item, onRemove, onUpdateQuantity }: {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}) => {
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : "/images/placeholder.png";
    const handleIncrease = () => onUpdateQuantity(item.id, item.quantity + 1);
    const handleDecrease = () => onUpdateQuantity(item.id, item.quantity - 1);
    const handleRemove = () => onRemove(item.id);
  
    return (
      <>
        <div className="hidden lg:flex items-center border-t border-white/20 py-5 px-6 text-sm">
          <div className="w-full max-w-sm flex items-center gap-5">
            <img src={imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded-md bg-white/10 p-1" />
            <div>
              <h3 className="font-semibold text-white">{item.name}</h3>
              <p className="text-white/70 text-xs mt-1">{item.model_name || `ID: ${item.id.substring(0, 8)}`}</p>
            </div>
          </div>
          <div className="w-36 text-center font-medium text-white">₹{Number(item.price).toFixed(2)}</div>
          <div className="w-48 flex justify-center">
            <div className="flex items-center border border-white/30 rounded-md bg-white/10">
              <button onClick={handleDecrease} className="px-3 py-2 text-white/80 hover:bg-white/20 rounded-l-md transition-colors duration-200">-</button>
              <span className="px-4 py-2 font-semibold text-white">{item.quantity}</span>
              <button onClick={handleIncrease} className="px-3 py-2 text-white/80 hover:bg-white/20 rounded-r-md transition-colors duration-200">+</button>
            </div>
          </div>
          <div className="w-36 text-center font-semibold text-white">₹{(Number(item.price) * item.quantity).toFixed(2)}</div>
          <div className="w-20 flex justify-end">
            <button onClick={handleRemove} className="text-white/60 hover:text-white transition-colors duration-200" aria-label="Remove item">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <div className="lg:hidden flex flex-col p-4 border-t border-white/20 space-y-4">
          <div className="flex items-start gap-4">
            <img src={imageUrl} alt={item.name} className="w-24 h-24 object-contain rounded-md bg-white/10 p-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-white">{item.name}</h3>
              <p className="text-white/80 mt-1">₹{Number(item.price).toFixed(2)}</p>
            </div>
            <button onClick={handleRemove} className="text-white/70 hover:text-white transition-colors duration-200" aria-label="Remove item">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-white/30 rounded-md bg-white/10">
              <button onClick={handleDecrease} className="px-3 py-1.5 text-white/80 hover:bg-white/20 rounded-l-md transition-colors duration-200">-</button>
              <span className="px-4 py-1.5 font-semibold text-white">{item.quantity}</span>
              <button onClick={handleIncrease} className="px-3 py-1.5 text-white/80 hover:bg-white/20 rounded-r-md transition-colors duration-200">+</button>
            </div>
            <p className="font-semibold text-lg text-white">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      </>
    );
};

const OrderSummary = ({ items, onCheckout }: { items: CartItem[]; onCheckout: () => void }) => {
    const { subtotal, shipping, total } = useMemo(() => {
        const subtotalCalc = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
        const shippingCalc = subtotalCalc > 500 ? 0 : 50;
        return { subtotal: subtotalCalc, shipping: shippingCalc, total: subtotalCalc + shippingCalc };
    }, [items]);

    return (
        <div className="w-full">
            <div className="rounded-lg shadow-lg overflow-hidden" style={{ background: "linear-gradient(to right,rgb(162, 197, 189),rgb(177, 201, 185),rgb(200, 196, 153),rgb(190, 151, 151))" }}>
                <div className="p-6 border-b border-white/20">
                    <h3 className="font-semibold text-xl text-white">Order Summary</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between text-white"><p>Subtotal</p><p className="font-medium">₹{subtotal.toFixed(2)}</p></div>
                    <div className="flex justify-between text-white"><p>Shipping</p><p className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</p></div>
                    <div className="border-t border-white/20 my-4"></div>
                    <div className="flex justify-between text-white text-lg"><p className="font-semibold">Total</p><p className="font-bold">₹{total.toFixed(2)}</p></div>
                    <button onClick={onCheckout} className="w-full mt-4 flex justify-center font-bold text-blue-900 bg-white py-3 px-6 rounded-lg ease-in-out duration-300 hover:bg-opacity-90 transform hover:scale-105 shadow-md">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

const Discount = () => (
    <div className="w-full">
        <div className="rounded-lg shadow-lg overflow-hidden" style={{ background: "linear-gradient(to right,rgb(162, 197, 189),rgb(177, 201, 185),rgb(200, 196, 153),rgb(190, 151, 151))" }}>
            <div className="p-6">
                <h3 className="font-semibold text-lg text-white mb-4">Have a discount code?</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" placeholder="Enter coupon code" className="rounded-md border-0 bg-white/80 placeholder:text-gray-600 w-full py-3 px-4 outline-none duration-200 focus:ring-2 focus:ring-white/50" />
                    <button className="inline-flex justify-center font-bold text-blue-900 bg-white py-3 px-8 rounded-lg ease-out duration-200 hover:bg-opacity-90 shadow-md">Apply</button>
                </div>
            </div>
        </div>
    </div>
);

const EnhancedCartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const handleProceedToCheckout = () => {
    localStorage.removeItem("checkoutOrder");
    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;
    const orderData = {
      items: cartItems,
      total: total,
    };
    localStorage.setItem('checkoutOrder', JSON.stringify(orderData));
    router.push('/checkout');
  };
  useEffect(() => {
    const loadCartFromStorage = () => {
      if (typeof window !== "undefined") {
        const storedItems = localStorage.getItem("cartItems");
        if (storedItems) {
          try {
            const parsedItems = JSON.parse(storedItems);
            
            if (Array.isArray(parsedItems)) {
              setCartItems(parsedItems);
            } else if (typeof parsedItems === 'object' && parsedItems !== null) {
              setCartItems([parsedItems]); 
            } else {
              setCartItems([]);
            }
          } catch (error) {
            console.error("Failed to parse cart items:", error);
            setCartItems([]);
          }
        }
      }
    };

    loadCartFromStorage();
    window.addEventListener('storage', loadCartFromStorage);
    window.addEventListener('cartUpdated', loadCartFromStorage);
    return () => {
      window.removeEventListener('storage', loadCartFromStorage);
      window.removeEventListener('cartUpdated', loadCartFromStorage);
    };
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleRemoveItem = (itemId: string) => updateCart(cartItems.filter(item => item.id !== itemId));
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return handleRemoveItem(itemId);
    updateCart(cartItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };
  const handleClearCart = () => {
    if(window.confirm("Are you sure you want to clear the entire cart?")) updateCart([]);
  };
  // const handleProceedToCheckout = () => router.push('/checkout');

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="container mx-auto px-4"><Breadcrumb title={"Cart"} pages={["Cart"]} /></section>
      {cartItems.length > 0 ? (
        <section className="container mx-auto py-8 lg:py-12 px-4  lg:p-[180px]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
            <button onClick={handleClearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
              Clear Cart
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-2 rounded-lg shadow-lg overflow-hidden" style={{ background: "linear-gradient(to right,rgb(162, 197, 189),rgb(177, 201, 185),rgb(200, 196, 153),rgb(190, 151, 151))" }}>
                <div className="hidden lg:flex bg-white/10 p-4 px-6 text-xs font-semibold text-white/80 uppercase tracking-wider">
                    <div className="w-full max-w-sm">Product</div>
                    <div className="w-36 text-center">Price</div>
                    <div className="w-48 text-center">Quantity</div>
                    <div className="w-36 text-center">Subtotal</div>
                    <div className="w-20 text-right"></div>
                </div>
                <div>
                    {cartItems.map((item) => <SingleItem key={item.id} item={item} onRemove={handleRemoveItem} onUpdateQuantity={handleUpdateQuantity} />)}
                </div>
            </div>
            <div className="lg:col-span-1 mt-8 lg:mt-0 space-y-8">
                <OrderSummary items={cartItems} onCheckout={handleProceedToCheckout} />
                <Discount />
            </div>
          </div>
        </section>
      ) : (
        <section className="text-center py-16 lg:py-24">
          <div className="mx-auto flex flex-col items-center">
            <svg className="w-24 h-24 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h2 className="mt-6 text-2xl font-semibold text-gray-700">Your cart is empty!</h2>
            <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link href="/shopping" className="mt-8 inline-block font-bold text-black bg-gray-800 py-3 px-8 rounded-lg shadow-lg ease-out duration-300 hover:bg-gray-900 transform hover:scale-105">Continue Shopping</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default EnhancedCartPage;