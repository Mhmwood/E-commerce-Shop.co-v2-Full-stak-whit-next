import React, { useState } from "react";

const StarsRating = ({
  rating,
  showNumber,
  onChange,
}: {
  rating: number;
  showNumber?: boolean;
  onChange?: (rating: number) => void;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const ratingNumber = rating ? Math.round(rating * 2) / 2 : 0;

  return (
    <div className="flex items-center ">
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          let fillType: "full" | "half" | "empty" = "empty";

          if (hovered !== null) {
            fillType = starValue <= hovered ? "full" : "empty";
          } else {
            if (starValue <= Math.floor(ratingNumber)) {
              fillType = "full";
            } else if (
              starValue === Math.ceil(ratingNumber) &&
              ratingNumber % 1 !== 0
            ) {
              fillType = "half";
            } else {
              fillType = "empty";
            }
          }

          return (
            <div
              key={starValue}
              className="relative w-5 h-5 cursor-pointer"
              onMouseEnter={onChange ? () => setHovered(starValue) : undefined}
              onMouseLeave={onChange ? () => setHovered(null) : undefined}
              onClick={onChange ? () => onChange(starValue) : undefined}
            >
              <svg
                className={`w-5 h-5 cursor-pointer transition-colors ${
                  fillType === "full" || fillType === "half"
                    ? "text-yellow-300"
                    : "text-gray-200 dark:text-gray-600"
                }`}
                fill="currentColor"
                viewBox="0 0 22 20"
                style={
                  fillType === "half"
                    ? { clipPath: "inset(0 50% 0 0)" }
                    : undefined
                }
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              {fillType === "half" && (
                <svg
                  className="absolute top-0 left-0 w-5 h-5 text-gray-200 dark:text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                  style={
                    fillType === "half"
                      ? { clipPath: "inset(0 0 0 50%)" }
                      : undefined
                  }
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className=" text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
          {ratingNumber}/5
        </span>
      )}
    </div>
  );
};

export default StarsRating;
