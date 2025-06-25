/* eslint-disable @next/next/no-img-element */
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const swiperCustomStyles = `
  .image-only-carousel .swiper-button-prev,
  .image-only-carousel .swiper-button-next {
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }
  .image-only-carousel .swiper-button-prev:hover,
  .image-only-carousel .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
  .image-only-carousel .swiper-button-prev:after,
  .image-only-carousel .swiper-button-next:after {
    font-size: 16px;
    font-weight: bold;
  }
  .image-only-carousel .swiper-pagination-bullet {
    background-color: rgba(255, 255, 255, 0.7);
    width: 10px;
    height: 10px;
    opacity: 1;
  }
  .image-only-carousel .swiper-pagination-bullet-active {
    background-color: white;
  }

  @media (min-width: 768px) {
    .image-only-carousel {
      height: 45%; 
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .image-only-carousel {
      height: 60vh;
    }
  }

  @media (min-width: 1025px) {
    .image-only-carousel {
      height: 75vh;
    }
  }
    @media (min-width: 400px) {
    .image-only-carousel {
      height: 30%;
      margin-top: 10%;
    }
  }
`;

const ImageOnlyCarousel = () => {
  const images = [
    "/images/ecommerce/1.jpg",
    "/images/ecommerce/2.jpg",
    "/images/ecommerce/3.jpg",
    "/images/ecommerce/1.jpg",
  ];

  return (
    <div className="w-full mt-[140px] md:mt-[15%] lg:mt-[13%]" style={{marginTop:250}}>
      <style>{swiperCustomStyles}</style>
      <div className="w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={false}
          pagination={{ clickable: true }}
          className="image-only-carousel w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`}>
              <img
                src={src}
                alt={`Carousel image ${index + 1}`}
                className="object-cover w-full h-full"
                style={{ objectPosition: 'center' }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImageOnlyCarousel;