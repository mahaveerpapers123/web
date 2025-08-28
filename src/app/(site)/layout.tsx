"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";

import "@/app/css/euclid-circular-a-font.css";
import "@/app/css/style.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { ReduxProvider } from "@/redux/provider";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";

import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export const metadata: Metadata = {
  title: "Mahaveer Paper Enterprises",
  description: "E-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          background:
            "linear-gradient(to right, #ccfbf1, #dcfce7, #fef9c3, #fecaca)",
          overflowX: "hidden",
        }}
      >
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Header />
                    <div className="sm:mt-[30px]">{children}</div>
                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>

            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
