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

  return (
    <div className="flex items-center ">
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {/* Full Stars */}
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          const isFilled =
            hovered !== null ? starValue <= hovered : starValue <= rating;
          return (
            <svg
              key={starValue}
              className={`w-5 h-5 cursor-pointer transition-colors ${
                isFilled
                  ? "text-yellow-300"
                  : "text-gray-200 dark:text-gray-600"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
              onMouseEnter={onChange ? () => setHovered(starValue) : undefined}
              onMouseLeave={onChange ? () => setHovered(null) : undefined}
              onClick={onChange ? () => onChange(starValue) : undefined}
              style={onChange ? { pointerEvents: "auto" } : {}}
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          );
        })}
      </div>
      {showNumber && (
        <span className=" text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarsRating;
