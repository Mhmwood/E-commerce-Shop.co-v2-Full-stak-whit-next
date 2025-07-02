"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const PriceSelector = () => {
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(500);
  const router = useRouter();

  const searchParams = useSearchParams();

  const applyFilter = () => {
    const category = searchParams.get("category");
    router.push(
      `/shop${
        category ? `/${category}` : ""
      }/?sortBy=price&order=desc&minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
  };

  return (
    <div className="w-full space-y-5 border-b border-gray-300">
      <div className="pb-6">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between p-3 text-left text-sm font-medium rounded-lg transition"
        >
          <h4 className="text-2xl font-bold mr-2 md:mr-0">Price</h4>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              open ? "-rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <div className="space-y-4 pl-4">
            <div className="space-y-6">
              <div className="pt-4">
                <div className="relative h-8">
                  {/* Background track */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-gray-200 rounded-lg">
                    {/* Active track */}
                    <div
                      className="absolute  h-2 bg-primary rounded-lg"
                      style={{
                        left: `${(minPrice / 500) * 100}%`,
                        right: `${100 - (maxPrice / 500) * 100}%`,
                      }}
                    >
                      <div className="absolute transform  left-0 translate-y-3 -translate-x-4">
                        ${minPrice}
                      </div>
                      <div className="absolute transform right-0  translate-y-3  translate-x-4">
                        ${maxPrice}
                      </div>
                    </div>
                  </div>
                  {/* Min price input */}
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step={10}
                    value={minPrice}
                    onChange={(e) => {
                      const value = Math.min(Number(e.target.value), maxPrice);
                      setMinPrice(value);
                    }}
                    className="absolute top-1/2 left-0 w-full h-2 [&::-webkit-slider-thumb]:size-4  -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:border-2 
           hover:[&::-webkit-slider-thumb]:size-5
            [&::-webkit-slider-thumb]:border-primary
             [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                  />
                  {/* Max price input */}
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step={10}
                    value={maxPrice}
                    onChange={(e) => {
                      const value = Math.max(Number(e.target.value), minPrice);
                      setMaxPrice(value);
                    }}
                    className="absolute top-1/2 left-0 w-full h-2 [&::-webkit-slider-thumb]:size-4  -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:border-2 
           hover:[&::-webkit-slider-thumb]:size-5
            [&::-webkit-slider-thumb]:border-primary
             [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={applyFilter}
        className="w-full text-white text-md py-3 px-4 md:px-20 lg:px-14
         hover:text-primary hover:bg-white border border-primary rounded-full bg-primary transition duration-150"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default PriceSelector;
