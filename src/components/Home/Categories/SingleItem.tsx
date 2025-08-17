import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: Category }) => {
  const title = item.title ?? item.name ?? item.label ?? "Category";
  const src = item.img && item.img.trim() !== "" ? item.img : null;
  const href = item.href ?? "#";

  return (
    <Link href={href} className="group flex flex-col items-center">
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
        {src ? (
          <Image
            className="ease-out duration-200 group-hover:scale-110"
            src={src}
            alt={title}
            width={282}
            height={262}
          />
        ) : (
          <div className="w-[120px] h-[90px] rounded bg-gray-200" />
        )}
      </div>
      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
