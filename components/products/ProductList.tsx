

"use client"; 
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "./ProductCard";
import { Product } from "@prisma/client";

const ProductList = ({
  products,
  className,
  flexxWrap,
}: {
  products: Product[];
  className?: string;
  flexxWrap?: boolean;
}) => {
  const [marginX, setMarginX] = useState(40);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setMarginX(scrollContainerRef.current.scrollLeft > 50 ? 0 : 40);
      }
    };

    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`w-full overflow-x-scroll no-scrollbar scroll-smooth transition duration-300 ${className}`}
      ref={scrollContainerRef}
    >
      <motion.ul
        className={`flex gap-5 ${flexxWrap ? "flex-wrap" : ""}`}
        animate={{ marginLeft: marginX }}
        transition={{ duration: 0.5, ease: "easeInOut" }} 
      >
        {products.map((product, index) => (
          <li key={index}>
            <ProductCard {...product} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default ProductList;
