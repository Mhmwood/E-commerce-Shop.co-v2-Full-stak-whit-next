"use client";
import formatCurrency from "@lib/utils";
import React from "react";

interface PriceDisplayProps {
  price: number;
  discount: number | null;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, discount }) => {
  const finalPrice = discount ? price - price * (discount / 100) : price;

  return (
    <div className="flex items-centerflex-wrap flex-wrap  ">
      <span className=" text-lg  lg:text-2xl font-bold text-gray-900 mr-2">
        {formatCurrency(finalPrice)}
      </span>
      {discount !== 0 && discount !== null && (
        <div className="   space-x-2 flex items-center">
          <span className="relative inline-block text-lg  lg:text-2xl font-bold text-gray-300">
            <span className="absolute inset-x-0 top-1/2 border text-gray-300"></span>
            {formatCurrency(price)}
          </span>

          <p className="bg-red-100 text-red-400 font-bold px-3 py-1 text-sm rounded-full">
            {discount}%
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
