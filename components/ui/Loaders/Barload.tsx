"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = 0;
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      active++;
      setLoading(true);
      try {
        return await originalFetch(...args);
      } finally {
        active--;
        if (active === 0) setLoading(false);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.6 }}
          className="h-[2px] bg-primary shadow-md shadow-primary/60 fixed top-[64px] lg:top-[80px] left-0 z-50"
        />
      )}
    </>
  );
}
