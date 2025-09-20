"use client";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "@/components/Home/Categories/SingleItem";
import { Category } from "@/types/category";

type CatIn = { label: string; value: string; image?: string | null };

const API = "https://mahaveerpapersbe.vercel.app";

const normalizeUrl = (u: any) =>
  typeof u === "string" && u.startsWith("http://") ? u.replace("http://", "https://") : u || "";

const fetchCategoryImage = async (slug: string) => {
  const trySlugs = [slug, slug.split("/").pop() || slug];
  for (const s of trySlugs) {
    const res = await fetch(`${API}/api/products?category=${encodeURIComponent(s)}&limit=1`, { cache: "no-store" });
    if (!res.ok) continue;
    const json = await res.json().catch(() => null);
    const img = json?.items?.[0]?.images?.[0];
    if (img) return normalizeUrl(img);
  }
  return "";
};

const RecentlyViewdItems = () => {
  const sliderRef = useRef<any>(null);
  const [items, setItems] = useState<Category[]>([]);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API}/api/categories`, { cache: "no-store" });
      const raw = (await res.json()) as CatIn[] | any;
      const list: CatIn[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.categories)
        ? raw.categories
        : [];
      const base = list.filter((c) => !!c?.label && !!c?.value && c.value !== "all").slice(0, 16);
      const imgs = await Promise.all(
        base.map(async (c) => {
          const fromApi = normalizeUrl(c.image);
          if (fromApi) return fromApi;
          return await fetchCategoryImage(c.value).catch(() => "");
        })
      );
      const normalized: Category[] = base.map((c, i) => {
        const title = String(c.label || "");
        const slug = String(c.value || "").toLowerCase();
        const href = `/shopping?category=${encodeURIComponent(slug)}`;
        const img = imgs[i] || "/images/placeholder.png";
        return { title, icon: img, img, href, slug } as any;
      });
      setItems(normalized);
    };
    load();
  }, []);

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">Categories</span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">Browse by Category</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="swiper-button-prev flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="swiper-button-next flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white hover:shadow-lg transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <Swiper
            ref={sliderRef}
            slidesPerView={4}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 12 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1200: { slidesPerView: 4, spaceBetween: 20 }
            }}
            className="justify-between"
          >
            {items.map((item, key) => (
              <SwiperSlide key={key}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden">
                    <SingleItem item={item} />
                  </div>
                  <div className="text-center text-sm font-medium line-clamp-2 max-w-[8rem] md:max-w-[9rem]">{item.title}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewdItems;
