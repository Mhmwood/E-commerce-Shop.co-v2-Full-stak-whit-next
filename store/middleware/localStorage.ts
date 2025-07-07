import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "..";

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      typeof action.type === "string" &&
      action.type.startsWith("cart/")
    ) {
      try {
        const state = store.getState().cart;
        localStorage.setItem("cart", JSON.stringify(state));
      } catch (error) {
        console.warn("Error saving cart state:", error);
      }
    }

    return result;
  };

export const loadState = (): RootState["cart"] | undefined => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.warn("Error loading cart state:", error);
    return undefined;
  }
};
