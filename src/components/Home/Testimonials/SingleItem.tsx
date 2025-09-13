import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
    className={filled ? "fill-yellow-400" : "fill-gray-300"}
  >
    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.402 8.166L12 18.896l-7.336 3.867 1.402-8.166L.132 9.211l8.2-1.193z" />
  </svg>
);

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  const rating = Math.max(0, Math.min(5, Math.round(testimonial.rating ?? 5)));
  return (
    <div className="shadow-testimonial bg-white rounded-[10px] py-7.5 px-4 sm:px-8.5 m-1">
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= rating} />
        ))}
      </div>
      {testimonial.title ? (
        <h4 className="text-dark font-semibold mb-2">{testimonial.title}</h4>
      ) : null}
      <p className="text-dark mb-4">{testimonial.review}</p>
      {Array.isArray(testimonial.images) && testimonial.images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {testimonial.images.slice(0, 6).map((src, idx) => (
            <div key={idx} className="relative w-full h-[100px] rounded-md overflow-hidden">
              <Image src={src} alt={`review-image-${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-4">
        <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
          <Image
            src={testimonial.authorImg || "/images/user-placeholder.png"}
            alt="author"
            width={50}
            height={50}
            className="h-[50px] w-[50px] rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-dark">{testimonial.authorName}</h3>
          <p className="text-custom-sm">{testimonial.authorRole}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
