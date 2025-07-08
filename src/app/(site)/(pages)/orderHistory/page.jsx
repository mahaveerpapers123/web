import React from 'react';
import { Metadata } from "next";
import OrderHistory from "@/components/OrderHistory";

export const metadata = {
  title: "Order History | Mahaveer Paper Enterprises",
  description: "View your order history and track your purchases.",
};

const OrderHistoryPage = () => {
  return (
    <main className="container mx-auto pb-20 pt-[150px] md:pt-[120px] lg:pt-[100px]">
        <OrderHistory />
    </main>
  );
};

export default OrderHistoryPage;