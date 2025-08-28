// src/app/layout.tsx
import type { Metadata } from "next";
import "./css/euclid-circular-a-font.css";
import "./css/style.css";

import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";

export const metadata: Metadata = {
  title: "Mahaveer Paper Enterprises",
  description: "E-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          background:
            "linear-gradient(to right, #ccfbf1, #dcfce7, #fef9c3, #fecaca)",
          overflowX: "hidden",
        }}
      >
        <Providers>
          <Header />
          <div className="sm:mt-[30px]">{children}</div>

          {/* Global modals / utilities */}
          <QuickViewModal />
          <CartSidebarModal />
          <PreviewSliderModal />
          <ScrollToTop />

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
