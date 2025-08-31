"use client";

import { useClickOutside } from "@/hooks/use-click-outside";
import { Product } from "@prisma/client";

import { useSearchProducts } from "@/hooks/useProducts";

import { Plus, ShoppingCart } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);

  const { addItem } = useCart();

  const router = useRouter();
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setQuery(""));

  const { data, isPending } = useSearchProducts(query, 7);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setResults(data?.products || []);
  };

  const handleAddToCart = (product: Product) => {
    console.log(product);
    addItem(
      {
        id: String(product.id),
        title: product.title,
        price: product.price,
        category: product.category!,
        image: product.thumbnail,
        discountPercentage: product.discountPercentage ?? 0,
        stock: product.stock,
      },
      1
    );
  };

  return (
    <div className="relative  flex flex-grow items-center bg-secondary rounded-full  ">
      <div className="pl-4 pr-2 text-gray-500">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400"
        >
          <path
            d="M21.7959 20.2041L17.3437 15.75C18.6787 14.0104 19.3019 11.8282 19.087 9.64607C18.8722 7.4639 17.8353 5.44516 16.1867 3.99937C14.5382 2.55357 12.4014 1.78899 10.2098 1.86071C8.01829 1.93244 5.93607 2.8351 4.38558 4.38559C2.83509 5.93608 1.93243 8.0183 1.8607 10.2098C1.78898 12.4014 2.55356 14.5382 3.99936 16.1867C5.44515 17.8353 7.46389 18.8722 9.64606 19.087C11.8282 19.3019 14.0104 18.6787 15.75 17.3438L20.2059 21.8006C20.3106 21.9053 20.4348 21.9883 20.5715 22.0449C20.7083 22.1016 20.8548 22.1307 21.0028 22.1307C21.1508 22.1307 21.2973 22.1016 21.4341 22.0449C21.5708 21.9883 21.695 21.9053 21.7997 21.8006C21.9043 21.696 21.9873 21.5717 22.044 21.435C22.1006 21.2983 22.1298 21.1517 22.1298 21.0037C22.1298 20.8558 22.1006 20.7092 22.044 20.5725C21.9873 20.4358 21.9043 20.3115 21.7997 20.2069L21.7959 20.2041ZM4.12499 10.5C4.12499 9.23915 4.49888 8.0066 5.19938 6.95824C5.89987 5.90988 6.89551 5.09278 8.06039 4.61027C9.22527 4.12776 10.5071 4.00151 11.7437 4.2475C12.9803 4.49348 14.1162 5.10064 15.0078 5.9922C15.8994 6.88376 16.5065 8.01967 16.7525 9.2563C16.9985 10.4929 16.8722 11.7747 16.3897 12.9396C15.9072 14.1045 15.0901 15.1001 14.0418 15.8006C12.9934 16.5011 11.7608 16.875 10.5 16.875C8.80977 16.8733 7.18927 16.2011 5.99411 15.0059C4.79894 13.8107 4.12673 12.1902 4.12499 10.5Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <input
        type="text"
        id="Search"
        placeholder="Search for products..."
        className="w-full py-3 pr-4 bg-transparent outline-none placeholder:text-gray-400 text-gray-700"
        onChange={handleSearchChange}
        value={query}
      />

      {query && (
        <div
          ref={dropdownRef}
          className="absolute w-full max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:rounded-t-xl max-lg:shadow-xl lg:h-80 overflow-y-auto no-scrollbar scroll-smooth top-40 lg:top-12 left-0 right-0 bg-white rounded-xl shadow-lg z-50 border border-gray-100"
        >
          {isPending && <div className="p-4 text-center">Loading...</div>}
          {!isPending && results.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No products found.
            </div>
          )}
          {results.map((product: Product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
              onClick={() => {
                setQuery("");
                router.push(`/shop/${product.id}`);
              }}
            >
              <div>
                <h2 className="text-sm font-medium text-gray-800  truncate overflow-hidden whitespace-nowrap  ">
                  {product.title}
                </h2>
                <p className="text-xs text-gray-500">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <button
                className="hidden md:block relative hover:scale-105 rounded-full hover:bg-secondary transition duration-150 ease-in-out"
                onClick={() => handleAddToCart(product)}
                aria-label="add to cart button"
              >
                <ShoppingCart />

                <Plus
                  className="  absolute  top-0 -right-1 z-50  bg-green-400 rounded-full text-white"
                  size={12}
                  strokeWidth={3}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
