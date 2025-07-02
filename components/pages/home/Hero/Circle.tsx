"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Circle = () => {
  const [isClicked, setIsClicked] = useState(false);

  const [showStars, setShowStars] = useState(false);

  const stars = [
    { id: 1, offsetX: -50, offsetY: -30 },
    { id: 2, offsetX: 40, offsetY: -50 },

    { id: 3, offsetX: 50, offsetY: 30 },
  ];

  return (
    <div>
      <div className="relative flex items-center justify-center">
        <motion.div
          className="w-80 h-80 bg-primary cursor-pointer relative"
          initial={false}
          animate={{
            borderRadius: isClicked ? "20%" : "50%",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsClicked(!isClicked);
            setShowStars(true);
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {showStars && (
            <AnimatePresence>
              {
                <div className="absolute inset-0">
                  {stars.map((star, index) => (
                    <motion.div
                    key={index}
                      className="absolute"
                      style={{
                        left: `${
                          Math.random() * (50 - 40) + 40 + star.offsetX
                        }%`,
                        top: `${
                          Math.random() * (50 - 40) + 40 + star.offsetY
                        }%`,
                      }}
                      animate={{
                        scale: [0,  1.3, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      onAnimationComplete={() => setShowStars(false)}
                    >
                      <motion.svg
                        width="40"
                        height="40"
                        viewBox="0 0 104 104"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 1.5 }}
                      >
                        <path
                          d="M52 0C53.7654 27.955 76.0448 50.2347 104 52C76.0448 53.7654 53.7654 76.0448 52 104C50.2347 76.0448 27.955 53.7654 0 52C27.955 50.2347 50.2347 27.955 52 0Z"
                          fill="currentColor"
                          className="text-gray-500"
                        />
                      </motion.svg>
                    </motion.div>
                  ))}
                </div>
              }
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Circle;
