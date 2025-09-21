"use client";

import { useCart } from "@hooks/useCart";
import formatCurrency from "@lib/utils";
import { LucideArrowRight, Tag } from "lucide-react";
import { useState } from "react";

const CartSummary = () => {
  const [promoCode, setPromoCode] = useState("");
  const [email, setEmail] = useState("");
  const { items, subtotal, discount, deliveryFee, total, applyPromo } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
const handleApplyPromo = (e: React.FormEvent) => {
  e.preventDefault();
  if (promoCode.trim()) {
    applyPromo(promoCode);
    setPromoCode("");
  }
};

  const handleCheckCart = async () => {
    setLoading(true);
    setCheckResult(null);
    setError("");
    try {
      // Cart is valid, now add all items to backend cart
      const addErrors: string[] = [];
      for (const item of items) {
        const addRes = await fetch(`${process.env.NEXTAUTH_URL}/api/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity,
          }),
        });
        if (!addRes.ok) {
          const addData = await addRes.json();
          addErrors.push(addData.error || `Failed to add item ${item.id}`);
        }
      }
      if (addErrors.length === 0) {
        setCheckResult(
          "Cart is valid and all items have been added to your cart!"
        );
        return true;
      } else {
        setCheckResult(
          `Cart is valid, but some items failed to add: ${addErrors.join("; ")}`
        );
        return false;
      }
    } catch {
      setCheckResult("Failed to check cart. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const cartValid = await handleCheckCart();
    if (!cartValid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to initiate checkout");
      }
    } catch {
      setError("Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border    space-y-6 rounded-3xl  px-6 w-full   md:col-span-2 py-6 h-min ">
      <h4 className="text-2xl font-bold mr-2 md:mr-0">Order Summary</h4>
      <div className="*:flex *:justify-between border-b py-6  ">
        <div>
          <span className="text-gray-400 ">Subtotal</span>
          <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>
        <div>
          <span className="text-gray-400 ">Discount (-20%)</span>
          <span className="font-bold text-[#FF3333]">
            -{formatCurrency(discount)}
          </span>
        </div>
        <div>
          <span className="text-gray-400 ">Delivery Fee</span>
          <span className="font-bold">{formatCurrency(deliveryFee)}</span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span className=" font-bold">{formatCurrency(total)}</span>
        </div>

        <div>
          <form
            onSubmit={handleApplyPromo}
            className="flex items-center  space-x-3 w-full"
          >
            <div className="flex  items-center bg-secondary py-3 px-4   rounded-full  ">
              <Tag className="text-gray-400 mr-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className=" text-primary outline-none bg-secondary w-full"
                required
              />
              
            </div>
            <button
              type="submit"
              className=" text-center flex-grow border   text-white  py-3 px-4   hover:text-primary hover:bg-white  border-primary rounded-full bg-primary transition duration-150"
            >
              Apply
            </button>
          </form>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full flex justify-center items-center
           text-white text-md py-4 px-5 md:px-20 lg:px-14 
           hover:text-primary hover:bg-white border border-primary rounded-full bg-primary transition duration-150 disabled:opacity-50"
        >
          {loading ? (
            <span className="mr-3">Redirecting...</span>
          ) : (
            <span className="mr-3">Go to Checkout</span>
          )}
          <LucideArrowRight className="" />
        </button>
        {checkResult && !error && (
          <div
            className={`text-center text-sm mt-2 ${
              checkResult.includes("valid") ? "text-green-600" : "text-red-500"
            }`}
          >
            {checkResult}
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default CartSummary;
