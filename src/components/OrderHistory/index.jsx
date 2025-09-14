/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "production"
      ? "https://mahaveerpapersbe.vercel.app"
      : "http://localhost:5000");

  /*useEffect(() => {
    try {
      const storedOrderData = localStorage.getItem('checkoutOrder');
      const allProductsData = localStorage.getItem('products');

      if (storedOrderData && allProductsData) {
        const orderData = JSON.parse(storedOrderData);
        const allProducts = JSON.parse(allProductsData);

        const enrichedItems = orderData.items.map(cartItem => {
          const productDetails = allProducts.find(p => p.id === cartItem.id);
          return {
            ...productDetails,
            quantity: cartItem.quantity,
          };
        });

        const totalAmount = parseFloat(orderData.total);
        const taxRate = 0.18; 
        const subtotal = totalAmount / (1 + taxRate);
        const taxes = totalAmount - subtotal;

        const finalOrder = {
          orderId: `ORD-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          items: enrichedItems,
          subtotal: subtotal.toFixed(2),
          taxes: taxes.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paymentMode: 'Online Payment',
          status: 'Delivered',
        };
        
        setOrders([finalOrder]);
      }
    } catch (error) {
      console.error("Failed to parse order history from localStorage:", error);
    }
    setIsLoading(false);
  }, []); */
  useEffect(() => {
    try {
      const storedOrderData = localStorage.getItem('checkoutOrder');
      const allProductsData = localStorage.getItem('products');

      if (storedOrderData && allProductsData) {
        const orderData = JSON.parse(storedOrderData);
        const allProducts = JSON.parse(allProductsData);

        const enrichedItems = orderData.items.map(cartItem => {
          const productDetails = allProducts.find(p => p.id === cartItem.id);
          return {
            ...productDetails,
            quantity: cartItem.quantity,
          };
        });

        const totalAmount = parseFloat(orderData.total);
        const taxRate = 0.18;
        const subtotal = totalAmount / (1 + taxRate);
        const taxes = totalAmount - subtotal;

        const finalOrder = {
          orderId: `ORD-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          items: enrichedItems,
          subtotal: subtotal.toFixed(2),
          taxes: taxes.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paymentMode: 'Online Payment',
          status: 'Delivered',
        };

        setOrders([finalOrder]);
      }
    } catch (error) {
      console.error("Failed to parse order history from localStorage:", error);
    }
    setIsLoading(false);
  }, []);


  const handleProceed = async () => {
    if (orders.length === 0) return;

    const order = orders[0];

    try {
      /*const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      }); */
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });


      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      const result = await response.json();
      console.log('✅ Order saved:', result);

      // Optionally: clear localStorage and redirect
      localStorage.removeItem('checkoutOrder');
      alert('Order placed successfully!');
      // window.location.href = '/success'; // optional redirect
    } catch (err) {
      console.error('❌ Error saving order:', err);
      alert('Something went wrong while placing the order.');
    }
  };





  const pageStyle = {
    background: "linear-gradient(to right, #ccfbf1, #dcfce7, #fef9c3, #fecaca)",
    overflowX: "hidden",
    minHeight: '100vh',
  };

  const cardStyle = {
    background: "linear-gradient(to right, rgb(162, 197, 189), rgb(177, 201, 185), rgb(200, 196, 153), rgb(190, 151, 151))",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (isLoading) {
    return <div style={pageStyle} className="flex items-center justify-center h-screen"><p className="text-2xl text-gray-700">Loading Order History...</p></div>;
  }

  return (
    <div style={pageStyle} className="w-full px-4 py-10 md:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="mb-12 text-4xl font-bold text-center text-transparent md:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r from-teal-600 to-amber-600"
      >
        Your Order History
      </motion.h1>

      <AnimatePresence>
        {orders.length > 0 ? (
          <motion.div
            className="max-w-5xl mx-auto space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {orders.map((order) => (
              <motion.div
                key={order.orderId}
                style={cardStyle}
                className="p-6 text-white rounded-2xl shadow-2xl md:p-8"
                variants={cardVariants}
                whileHover={{ y: -10, rotateX: 2, boxShadow: "0px 30px 40px -15px rgba(0,0,0,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col pb-4 mb-6 border-b border-white/30 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-wide">Order #{order.orderId}</h2>
                    <p className="text-sm text-white/80">Placed on {order.date}</p>
                  </div>
                  <div className="px-4 py-1 mt-4 text-sm font-semibold tracking-wider text-green-900 uppercase bg-green-200 rounded-full md:mt-0 w-fit">
                    {order.status}
                  </div>
                </div>

                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4">
                      <img src={item.image} alt={item.name} className="object-cover w-20 h-20 border-2 rounded-lg shadow-md border-white/50" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-white/80">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium">Price: ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-8 border-t border-white/30">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-white/10">
                      <h4 className="font-semibold">Payment Summary</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="flex justify-between"><span>Subtotal:</span> <span>₹{order.subtotal}</span></p>
                        <p className="flex justify-between"><span>Taxes (18%):</span> <span>₹{order.taxes}</span></p>
                        <p className="flex justify-between pt-2 mt-2 font-bold border-t border-white/20"><span>Total:</span> <span>₹{order.totalAmount}</span></p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/10">
                      <h4 className="font-semibold">Payment & Delivery</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><strong>Method:</strong> {order.paymentMode}</p>
                        <p><strong>Address:</strong> Hyderabad, 500081, India</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleProceed}
                    className="mt-6 px-6 py-2 text-white font-semibold bg-green-600 hover:bg-green-700 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    Proceed
                  </button>

                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <p className="mb-6 text-xl text-gray-700">You have no past orders.</p>
            <a href="/shopping" className="px-8 py-3 font-semibold text-white transition-transform duration-300 transform bg-teal-500 rounded-lg shadow-lg hover:bg-teal-600 hover:scale-105">
              Start Shopping
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistory;