"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import StarsRating from "@/components/ui/StarsRating";
import PriceDisplay from "@/components/products/PriceDisplay";
import { Product } from "@prisma/client";
import { useCart } from "@/hooks/useCart";

interface InfoDisplayProps {
  product: Product;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { items, updateItemQuantity, addItem, removeItem } = useCart();

  // Ensure both IDs are the same type for comparison
  const cartItem = items.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity ?? quantity;

  const handleQuantityChange = (change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      if (cartItem) {
        updateItemQuantity(product.id, newQuantity);
      } else {
        setQuantity(newQuantity);
      }
    }
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category!,
        image: product.thumbnail,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
      },
      currentQuantity
    );
    setQuantity(1);
  };

  return (
    <div className="flex flex-col divide-y divide-black/10">
      <header className="pb-6">
        <h2 className="font-integral font-extrabold text-2xl leading-[1.2] md:text-[2rem] lg:text-[2.5rem]">
          {product.title}
        </h2>
        {product.rating && <StarsRating rating={product.rating} />}

        <PriceDisplay
          price={product.price}
          discount={product.discountPercentage}
        />

        <p className="mt-3 leading-[1.375rem] text-black/60 max-md:text-sm">
          {product.description}
        </p>
      </header>

      <div className="space-y-4 py-6 text-sm">
        <h3 className="text-black/60">Tags</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-secondary px-5 py-2 capitalize text-black/60 border"
            >
              #{tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 py-6 md:gap-4">
        <div className="flex items-center justify-center gap-6 rounded-full bg-secondary font-medium  border">
          <button
            type="button"
            onClick={() => {
              // Check if the product exists in the cart and if the quantity is 1, remove it
              if (cartItem && currentQuantity === 1) removeItem(product.id);
              else handleQuantityChange(-1);
            }}
            className="active:scale-90 px-5 py-3 border-r   "
          >
            <Minus className="size-4 md:size-6  " />
          </button>

          <span>{currentQuantity}</span>

          <button
            type="button"
            onClick={() => {
              if (currentQuantity === 1) {
                handleAddToCart();
              }
              handleQuantityChange(1);
            }}
            className="active:scale-90 px-5 py-3  border-l "
          >
            <Plus className="size-4 md:size-6" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-white w-full  text-sm lg:text-lg py-3 px-4 md:px-20 lg:px-14  border border-primary rounded-full text-primary  hover:bg-primary hover:text-white transition duration-150 "
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default InfoDisplay;
