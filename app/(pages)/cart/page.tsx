// "use client";
// import { useEffect } from "react";
// import { useAppDispatch } from "@/store/hooks";
// import { fetchCart } from "@/store/features/cart.slice";
import CartList from "@/components/pages/cart/CartList";
import CartSummary from "@/components/pages/cart/CartSummary";
import BreadcrumbBar from "@/components/shadcn-components/BreadcrumbBar";

const CartPage = () => {

  return (
    <div className="py-10 md:py-20 px-4 md:px-20 mt-10 space-y-6">
      <BreadcrumbBar secondLink={"Cart"} />

      <h2 className=" font-extrabold text-4xl ">YOUR CART</h2>

      <div className="grid  grid-cols-1 lg:grid-cols-5 gap-5  ">
        <CartList />

        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;
