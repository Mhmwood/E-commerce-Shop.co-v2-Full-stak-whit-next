// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadState } from "../middleware/localStorage";
import type { CartState, CartItem } from "@/types";

const persistedState = loadState();

const initialState: CartState = persistedState || {
  items: [],
  status: "idle",
  error: null,
  discount: 0,
  deliveryFee: 15,
  promoCode: undefined,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { stock, quantity } = action.payload;
      if (typeof stock === "number" && quantity > stock) {
        // Optionally, you could set an error or return early
        // For now, just prevent adding more than stock
        alert("u vca");

        return;
      }

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity: Math.max(1, quantity),
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const validCodes: Record<string, number> = {
        SAVE10: 10,
        SAVE20: 20,
        FREESHIP: 0,
      };

      const code = action.payload.toUpperCase();

      if (validCodes[code] !== undefined) {
        state.promoCode = code;

        if (code === "FREESHIP") {
          state.discount = 0;
        } else {
          const subtotal = state.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
          state.discount = subtotal * (validCodes[code] / 100);
        }
      } else {
        state.promoCode = undefined;
        state.discount = 0;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = undefined;
      state.discount = 0;
    },
  },
});

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export const selectCartDiscount = (state: { cart: CartState }) =>
  state.cart.discount;

export const selectDeliveryFee = (state: { cart: CartState }) => {
  if (state.cart.promoCode === "FREESHIP") return 0;
  return state.cart.deliveryFee;
};

export const selectCartTotal = (state: { cart: CartState }) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscount(state);
  const deliveryFee = selectDeliveryFee(state);

  return Math.max(0, subtotal - discount + deliveryFee);
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyPromoCode,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

