import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mahaveer paper enterprises",
  description: "Mahaveer paper enterprises is a leading paper supplier in India, offering a wide range of high-quality paper products for various industries.",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
