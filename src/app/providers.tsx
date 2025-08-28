// src/app/providers.tsx
"use client";

import { useEffect, useState } from "react";
import { ReduxProvider } from "@/redux/provider";
import { CartModalProvider } from "@/app/context/CartSidebarModalContext";
import { ModalProvider } from "@/app/context/QuickViewModalContext";
import { PreviewSliderProvider } from "@/app/context/PreviewSliderContext";
import PreLoader from "@/components/Common/PreLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PreLoader />;

  return (
    <ReduxProvider>
      <CartModalProvider>
        <ModalProvider>
          <PreviewSliderProvider>{children}</PreviewSliderProvider>
        </ModalProvider>
      </CartModalProvider>
    </ReduxProvider>
  );
}
