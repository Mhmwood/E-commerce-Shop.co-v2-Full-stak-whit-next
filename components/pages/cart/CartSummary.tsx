"use client";

// import { useCart } from "@/hooks/use-cart";
// import formatCurrency from "@/utils/formatCurrency";
import { LucideArrowRight, Tag } from "lucide-react";
import { useState } from "react";

const CartSummary = () => {
  const [promoCode, setPromoCode] = useState("");
  // const { subtotal, discount, deliveryFee, total, applyPromo } = useCart();

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      // applyPromo(promoCode);
      setPromoCode("");
    }
  };
  return (
    <div className="border    space-y-6 rounded-3xl  px-6 w-full   md:col-span-2 py-6 h-min ">
      <h4 className="text-2xl font-bold mr-2 md:mr-0">Order Summary</h4>
      <div className="*:flex *:justify-between border-b py-6  ">
        <div>
          <span className="text-gray-400 ">Subtotal</span>
          {/* <span className="font-bold">{formatCurrency(subtotal)}</span> */}
        </div>
        <div>
          <span className="text-gray-400 ">Discount (-20%)</span>
          {/* <span className="font-bold text-[#FF3333]">
            -{formatCurrency(discount)}
          </span> */}
        </div>
        <div>
          <span className="text-gray-400 ">Delivery Fee</span>
          {/* <span className="font-bold">{formatCurrency(deliveryFee)}</span> */}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between text-lg">
          <span>Total</span>
          {/* <span className=" font-bold">{formatCurrency(total)}</span> */}
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
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
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
          // onClick={() => {}}
          className="w-full flex justify-center items-center
           text-white text-md py-4 px-5 md:px-20 lg:px-14 
           hover:text-primary hover:bg-white border border-primary rounded-full bg-primary transition duration-150"
        >
          <span className="mr-3">Go to Checkout</span>
          <LucideArrowRight className="" />
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
