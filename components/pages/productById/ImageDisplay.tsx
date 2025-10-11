"use client";
import ShowError from "@components/ui/errs/ShowError";
import Image from "next/image";

import { useState } from "react";

interface ImageDisplayProps {
  images: string[] | undefined;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images?.[0] || "");

  if (!images?.length) {
    return (
      <div className="rounded-xl bg-warn/10 p-4">
        <ShowError errorMsg="No images available" />
      </div>
    );
  }

  return (
    <div
      className={`grid gap-3.5  ${
        images.length > 1 && "md:grid-cols-[9.5rem_1fr]"
      }`}
    >
      {images.length > 1 && (
        <div className="flex w-full gap-3.5 md:flex-col">
          {images.slice(0, 3).map((image, index) => (
            <figure
              key={index}
              onClick={() => setMainImage(image)}
              onMouseEnter={() => setMainImage(image)}
              className=" relative aspect-square  min-w-[7rem]  overflow-hidden rounded-[1.25rem] bg-neutral-100 md:aspect-[19/21] md:max-w-[9.5rem]"
            >
              <Image
                src={image}
                className="object-cover transition-all duration-300 hover:scale-105"
                alt={`Product Image ${index + 1}`}
                height={150}
                width={150}
              />
            </figure>
          ))}
        </div>
      )}

      <div
        className={`relative w-full overflow-hidden rounded-[1.25rem] bg-neutral-200 max-md:row-start-1 
          flex justify-center items-center
    ${!(images.length > 1) && "  md:h-[444px] md:w-[444px]"}`}
      >
        <Image
          src={mainImage}
          className="object-contain transition-all duration-300"
          alt="Product Main Image"
          width={images.length > 1 ? 444 : 300}
          height={images.length > 1 ? 444 : 300}
        />
      </div>
    </div>
  );
};
export default ImageDisplay;
