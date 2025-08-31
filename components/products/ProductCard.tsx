"use client";
import StarsRating from "@/components/ui/StarsRating";

import PriceDisplay from "./PriceDisplay";
import { Product } from "@prisma/client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = ({
  title,
  images,
  thumbnail,
  price,
  rating,
  discountPercentage,
  id,
}: Product) => {
  const router = useRouter();

  return (
    <div className=" max-w-[295px] cursor-pointer">
      <div
        className="overflow-hidden rounded-[1.25rem]"
        onClick={() => router.push(`/shop/${id}`)}
      >
        <figure className="block  bg-secondary">
          {(!images || images.length === 0) && !thumbnail ? (
            <div className="rounded-xl bg-warn/10 p-4 w-full h-[298px]">
              No product images available
            </div>
          ) : (
            <Image
              className="transform transition-transform duration-300 hover:scale-105 object-cover w-full h-[298px]"
              src={
                thumbnail && thumbnail.includes("example.com")
                  ? "https://bkddaewshluqnvphgnqv.supabase.co/storage/v1/object/public/avatars/users/1750361164941-2cjwdmitlro.png"
                  : thumbnail
              }
              alt={title}
              loading="lazy"
              width={295}
              height={298}
            />
          )}
        </figure>
      </div>
      <div className="px-5 pb-5 mt-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <StarsRating rating={rating} showNumber />
        <PriceDisplay price={price} discount={discountPercentage} />
      </div>
    </div>
  );
};

export default ProductCard;
