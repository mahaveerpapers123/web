// import { Product } from "@/types/product";
// const shopData: Product[] = [
//   {
//     title: "Pins",
//     discription:
//       "Notice Board pins are essential office supplies used for attaching documents, notes, and reminders to bulletin boards or corkboards. These pins come in various sizes and colors, making them suitable for different purposes. They are designed to securely hold papers in place without damaging them, ensuring your important information is always visible.",
//     reviews: 15,
//     price: 59.0,
//     discountedPrice: 29.0,
//     id: 1,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/3.png",
//         "/images/stationary/3.png",
//       ],
//       previews: [
//         "/images/stationary/3.png",
//         "/images/stationary/3.png",
//       ],
//     },
//   },
//   {
//     title: "Staples",
//     discription:
//       "Staples are essential office supplies used for binding papers together. They come in various sizes and types, suitable for different staplers and binding needs. High-quality staples ensure a secure hold and prevent paper damage, making them ideal for both home and office use. Perfect for organizing documents, reports, and important papers.",
//     reviews: 5,
//     price: 899.0,
//     discountedPrice: 99.0,
//     id: 2,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/75.png",
//         "/images/stationary/75.png",
//       ],
//       previews: [
//         "/images/stationary/75.png",
//         "/images/stationary/75.png",
//       ],
//     },
//   },
//   {
//     title: "Favi Bond",
//     discription:
//       "Favi Bond is a high-quality adhesive tape designed for various bonding applications. It features a strong, durable construction that ensures a secure hold on a variety of surfaces. Ideal for both indoor and outdoor use, Favi Bond is perfect for home repairs, crafting, and more.",
//     reviews: 5,
//     price: 59.0,
//     discountedPrice: 29.0,
//     id: 3,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/10.png",
//         "/images/stationary/10.png",
//       ],
//       previews: [
//         "/images/stationary/10.png",
//         "/images/stationary/10.png",
//       ],
//     },
//   },
//   {
//     title: "Files",
//     discription:
//       "This set of 12 files is perfect for organizing documents, reports, and important papers. Each file is made from high-quality materials, ensuring durability and longevity. The set includes various colors and designs, making it easy to categorize and find your documents quickly. Ideal for students, professionals, or anyone looking to keep their paperwork tidy and accessible.",
//     reviews: 6,
//     price: 59.0,
//     discountedPrice: 29.0,
//     id: 4,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/52.png",
//         "/images/stationary/52.png",
//       ],
//       previews: [
//         "/images/stationary/52.png",
//         "/images/stationary/52.png",
//       ],
//     },
//   },
//   {
//     title: "Folder Set of 4",
//     discription:
//       "This set of 4 file folders comes in four vibrant colors, perfect for organizing documents, reports, and important papers. Each folder is made from durable materials to ensure longevity and features a secure closure to keep contents safe. Ideal for students, professionals, or anyone looking to keep their paperwork tidy and accessible.",
//     reviews: 3,
//     price: 99.0,
//     discountedPrice: 29.0,
//     id: 5,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/60.png",
//         "/images/stationary/60.png",
//       ],
//       previews: [
//         "/images/stationary/60.png",
//         "/images/stationary/60.png",
//       ],
//     },
//   },
//   {
//     title: "Flex Tape",
//     discription:
//       "Flex Tape is a powerful adhesive tape designed for repairing and sealing various surfaces. It is waterproof, flexible, and can be used on wet or dry surfaces. Ideal for both indoor and outdoor use, Flex Tape provides a strong bond that can withstand extreme conditions, making it perfect for home repairs, automotive fixes, and more.",
//     reviews: 15,
//     price: 59.0,
//     discountedPrice: 29.0,
//     id: 6,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/21.png",
//         "/images/stationary/21.png",
//       ],
//       previews: [
//         "/images/stationary/21.png",
//         "/images/stationary/21.png",
//       ],
//     },
//   },
//   {
//     title: "Diary",
//     discription:
//       "The Diary is a beautifully crafted notebook designed for jotting down thoughts, ideas, and daily reflections. It features high-quality paper, a durable cover, and an elegant design that makes it perfect for both personal use and professional settings. The diary is available in various sizes and colors to suit your style.",
//     reviews: 15,
//     price: 59.0,
//     discountedPrice: 29.0,
//     id: 7,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/37.png",
//         "/images/stationary/37.png",
//       ],
//       previews: [
//         "/images/stationary/37.png",
//         "/images/stationary/37.png",
//       ],
//     },
//   },
//   {
//     title: "Hauser XO Liquid Ink Roller Pen",
//     discription:
//       "The Hauser XO Liquid Ink Roller Pen is a premium writing instrument designed for smooth and precise writing. It features a liquid ink system that delivers consistent ink flow, ensuring a clean and effortless writing experience. The pen's ergonomic design provides comfort during extended use, making it ideal for both everyday writing and professional tasks.",
//     reviews: 15,
//     price: 59.0,
//     discountedPrice: 29.0,
//     id: 8,
//     imgs: {
//       thumbnails: [
//         "/images/stationary/80.png",
//         "/images/stationary/80.png",
//       ],
//       previews: [
//         "/images/stationary/80.png",
//         "/images/stationary/80.png",
//       ],
//     },
//   },
// ];

// export default shopData;

// src/components/Shop/shopData.ts

import { Product } from "@/types/product";

interface ApiResponse {
  page: number;
  limit: number;
  total: number;
  items: Product[];
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const imagesToArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    if (trimmed.includes(",")) return trimmed.split(",").map(s => s.trim()).filter(Boolean);
    return [trimmed];
  }
  return [];
};

export const shopData = async (
  page: number,
  limit: number,
  category?: string | null
): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category && category !== "all") params.append("category", category);

  const res = await fetch(`${API_BASE}/api/products?${params.toString()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch products (${res.status}): ${text}`);
  }

  const data: ApiResponse = await res.json();

  data.items = data.items.map((p) => ({
    ...p,
    images: imagesToArray((p as any).images),
  })) as Product[];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("products", JSON.stringify(data.items));
    } catch {}
  }

  return data;
};
