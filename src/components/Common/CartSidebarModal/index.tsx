// "use client";
// import React, { useEffect, useState } from "react";

// import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
// import {
//   removeItemFromCart,
//   selectTotalPrice,
// } from "@/redux/features/cart-slice";
// import { useAppSelector } from "@/redux/store";
// import { useSelector } from "react-redux";
// import SingleItem from "./SingleItem";
// import Link from "next/link";
// import EmptyCart from "./EmptyCart";
// import { useRouter } from "next/navigation";
// import { LucideBluetoothConnected } from "lucide-react";

// const CartSidebarModal = () => {
//   const { isCartModalOpen, closeCartModal } = useCartModalContext();
//   const cartItems = useAppSelector((state) => state.cartReducer.items);

//   const totalPrice = useSelector(selectTotalPrice);
//   const router = useRouter();
//   useEffect(() => {
//     // closing modal while clicking outside
//     function handleClickOutside(event) {
//       if (!event.target.closest(".modal-content")) {
//         closeCartModal();
//       }
//     }

//     if (isCartModalOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isCartModalOpen, closeCartModal]);

//   const handleProceedToCheckout = () => {
//     const orderData = {
//       items: cartItems,
//       total: totalPrice,
//     };
//     localStorage.setItem('checkoutOrder', JSON.stringify(orderData));
//     router.push('/checkout');
//   };

//   return (
//     <div
//       className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
//         isCartModalOpen ? "translate-x-0" : "translate-x-full"
//       }`}
//     >
//       <div className="flex items-center justify-end">
//         <div className="w-full max-w-[500px] shadow-1 bg-white px-4 sm:px-7.5 lg:px-11 relative modal-content">
//           <div className="sticky top-0 bg-white flex items-center justify-between pb-7 pt-4 sm:pt-7.5 lg:pt-11 border-b border-gray-3 mb-7.5">
//             <h2 className="font-medium text-dark text-lg sm:text-2xl">
//               Cart View
//             </h2>
//             <button
//               onClick={() => closeCartModal()}
//               aria-label="button for close modal"
//               className="flex items-center justify-center ease-in duration-150 bg-meta text-dark-5 hover:text-dark"
//             >
//               <svg
//                 className="fill-current"
//                 width="30"
//                 height="30"
//                 viewBox="0 0 30 30"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M12.5379 11.2121C12.1718 10.846 11.5782 10.846 11.212 11.2121C10.8459 11.5782 10.8459 12.1718 11.212 12.5379L13.6741 15L11.2121 17.4621C10.846 17.8282 10.846 18.4218 11.2121 18.7879C11.5782 19.154 12.1718 19.154 12.5379 18.7879L15 16.3258L17.462 18.7879C17.8281 19.154 18.4217 19.154 18.7878 18.7879C19.154 18.4218 19.154 17.8282 18.7878 17.462L16.3258 15L18.7879 12.5379C19.154 12.1718 19.154 11.5782 18.7879 11.2121C18.4218 10.846 17.8282 10.846 17.462 11.2121L15 13.6742L12.5379 11.2121Z"
//                   fill=""
//                 />
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M15 1.5625C7.57867 1.5625 1.5625 7.57867 1.5625 15C1.5625 22.4213 7.57867 28.4375 15 28.4375C22.4213 28.4375 28.4375 22.4213 28.4375 15C28.4375 7.57867 22.4213 1.5625 15 1.5625ZM3.4375 15C3.4375 8.61421 8.61421 3.4375 15 3.4375C21.3858 3.4375 26.5625 8.61421 26.5625 15C26.5625 21.3858 21.3858 26.5625 15 26.5625C8.61421 26.5625 3.4375 21.3858 3.4375 15Z"
//                   fill=""
//                 />
//               </svg>
//             </button>
//           </div>

//           <div className="h-[66vh] overflow-y-auto no-scrollbar">
//             <div className="flex flex-col gap-6">
//               {/* <!-- cart item --> */}
//               {cartItems.length > 0 ? (
//                 cartItems.map((item, key) => (
//                   <SingleItem
//                     key={key}
//                     item={item}
//                     removeItemFromCart={removeItemFromCart}
//                   />
//                 ))
//               ) : (
//                 <EmptyCart />
//               )}
//             </div>
//           </div>

//           <div className="border-t border-gray-3 bg-white pt-5 pb-4 sm:pb-7.5 lg:pb-11 mt-7.5 sticky bottom-0">
//             <div className="flex items-center justify-between gap-5 mb-6">
//               <p className="font-medium text-xl text-dark">Subtotal:</p>

//               <p className="font-medium text-xl text-dark">₹{totalPrice}</p>
//             </div>

//             <div className="flex items-center gap-4">
//               <Link
//                 onClick={() => closeCartModal()}
//                 href="/cart"
//                 className="w-full flex justify-center font-medium text-white bg-blue py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
//               >
//                 View Cart
//               </Link>

//               <button
//                 onClick={handleProceedToCheckout}
//                 className="w-full flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
//               >
//                 Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartSidebarModal;


"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type definition for a cart item
interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  images?: string[];
}

// --- CHILD COMPONENT 1: Premium Single Item View ---
const SingleItem = ({ item, onRemove, onUpdateQuantity }: {
  item: CartItem,
  onRemove: (id: string) => void,
  onUpdateQuantity: (id: string, newQuantity: number) => void
}) => {
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : "/images/placeholder.png";

  return (
    <div className="flex items-center gap-4 transition-opacity duration-300">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img src={imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
      </div>
      <div className="flex-1 flex flex-col justify-between h-24 py-1">
        <div>
          <h4 className="font-semibold text-dark text-base leading-tight hover:text-blue">
            <Link href="/shop-details">{item.name}</Link>
          </h4>
          <p className="text-gray-500 text-sm mt-1">
            ₹{Number(item.price).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center border border-gray-200 rounded-full">
              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-500 hover:text-dark transition-colors">-</button>
              <span className="px-3 py-1 text-sm font-semibold text-dark">{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-500 hover:text-dark transition-colors">+</button>
            </div>
            <p className="font-bold text-dark text-base">
                ₹{(Number(item.price) * item.quantity).toFixed(2)}
            </p>
        </div>
      </div>
       <button
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
        className="text-gray-300 hover:text-red-500 transition-all duration-300 self-start mt-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// --- CHILD COMPONENT 2: Premium Empty Cart View ---
const EmptyCart = ({ onContinueShopping }: { onContinueShopping: () => void }) => (
  <div className="flex flex-col items-center justify-center text-center h-full px-4">
    <svg className="w-28 h-28 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <h3 className="mt-6 text-xl font-semibold text-dark">Your Cart is Empty</h3>
    <p className="mt-2 text-gray-500 text-sm">Add items to your cart to see them here.</p>
    <button
      onClick={onContinueShopping}
      className="mt-8 w-full font-semibold text-white bg-dark py-3 px-6 rounded-lg ease-out duration-300 hover:bg-opacity-90 transform hover:scale-105"
    >
      Continue Shopping
    </button>
  </div>
);

// --- MAIN SIDEBAR COMPONENT ---
const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const { subtotal, shipping, total } = useMemo(() => {
    const subtotalCalc = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
    const shippingCalc = subtotalCalc > 500 ? 0 : 50;
    return { subtotal: subtotalCalc, shipping: shippingCalc, total: subtotalCalc + shippingCalc };
  }, [cartItems]);

  useEffect(() => {
    const loadCart = () => {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem("cartItems");
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        if (Array.isArray(parsedItems)) {
          setCartItems(parsedItems);
        }
      }
    };
    
    if (isCartModalOpen) {
        loadCart();
    }
    
    window.addEventListener('cartUpdated', loadCart);

    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, [isCartModalOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    updateCart(updatedCart);
  };
  
  const handleCheckout = () => {
    localStorage.removeItem("checkoutOrder");
    const orderData = {
      items: cartItems,
      total: total,
    };
    localStorage.setItem('checkoutOrder', JSON.stringify(orderData));
    router.push('/checkout');
  };
  
  const handleViewCart = () => {
    closeCartModal();
    router.push('/cart');
  };

  return (
    <div
      className={`fixed inset-0 z-99999 flex justify-end bg-dark/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
        isCartModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`w-full max-w-lg h-full bg-white shadow-2xl flex flex-col modal-content transition-transform duration-500 ease-in-out ${
          isCartModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
        background:
          "linear-gradient(to right, #ccfbf1, #dcfce7, #fef9c3, #fecaca)",overflowX: "hidden",
          
        }}
      >
        <div className="flex items-center justify-between p-5 border-b border-dark">
          <h2 className="font-bold text-dark text-2xl tracking-tight">Your Cart</h2>
          <button
            onClick={closeCartModal}
            aria-label="close cart modal"
            className="text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-full"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <SingleItem
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))
          ) : (
            <EmptyCart onContinueShopping={closeCartModal} />
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-dark bg-white"
          style={{
        background:
          "linear-gradient(to right, #ccfbf1, #dcfce7, #fef9c3, #fecaca)",overflowX: "hidden",
          
        }}>
            <div className="space-y-3 mb-5">
                <div className="flex justify-between text-dark"><p>Subtotal</p><p>₹{subtotal.toFixed(2)}</p></div>
                <div className="flex justify-between text-dark"><p>Shipping</p><p>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</p></div>
                <div className="border-t border-dark my-2"></div>
                <div className="flex justify-between text-dark text-lg font-bold"><p>Total</p><p>₹{total.toFixed(2)}</p></div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCheckout}
                className="w-full text-center font-semibold text-white bg-dark py-3.5 px-6 rounded-lg ease-out duration-300 hover:bg-opacity-80 shadow-lg"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleViewCart}
                className="w-full text-center font-semibold text-dark bg-gray-100 py-3.5 px-6 rounded-lg ease-out duration-300 hover:bg-gray-200"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebarModal;