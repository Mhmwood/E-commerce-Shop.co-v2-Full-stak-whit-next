import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart.slice";

import { localStorageMiddleware } from "./middleware/localStorage";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
