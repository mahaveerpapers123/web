"use client";
import React, { useCallback, useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "@/components/Home/Categories/SingleItem";
import { Category } from "@/types/category";

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
      try {
        const res = await fetch("https://mahaveerbe.vercel.app/api/categories", { cache: "no-store" });
        const json = await res.json();
        const raw: any[] =
          Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.categories) ? json.categories : [];
        const normalized: Category[] = raw.map((c) => {
          const title = c?.title ?? c?.name ?? c?.label ?? "";
          const icon = c?.icon ?? c?.image ?? c?.thumbnail ?? null;
          const slug = c?.slug ?? c?.id ?? title.toString().toLowerCase().replace(/\s+/g, "-");
          const href = c?.href ?? `/category/${slug}`;
          const img = icon || null;
          return { ...c, title, icon, img, href, slug };
        });
        setItems(normalized);
      } catch {
        setItems([]);
      }
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
          <Swiper ref={sliderRef} slidesPerView={4} spaceBetween={20} className="justify-between">
            {items.map((item, key) => (
              <SwiperSlide key={key}>
                <SingleItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewdItems;
