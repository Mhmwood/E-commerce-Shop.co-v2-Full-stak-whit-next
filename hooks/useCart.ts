import {
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartDiscount,
  selectDeliveryFee,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyPromoCode,
} from "@/store/features/cart.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { CartItem } from "@/types";

export const useCart = () => {
  const dispatch = useAppDispatch();

  return {
    // State
    items: useAppSelector(selectCartItems),
    total: useAppSelector(selectCartTotal),
    subtotal: useAppSelector(selectCartSubtotal),
    discount: useAppSelector(selectCartDiscount),
    deliveryFee: useAppSelector(selectDeliveryFee),

    // Actions
    addItem: (item: Omit<CartItem, "quantity">, quantity: number) =>
      dispatch(addToCart({ ...item, quantity })),
    removeItem: (id: string) => dispatch(removeFromCart(id)),
    updateItemQuantity: (id: string, quantity: number) =>
      dispatch(updateQuantity({ id, quantity })),
    applyPromo: (code: string) => dispatch(applyPromoCode(code)),
  };
};
