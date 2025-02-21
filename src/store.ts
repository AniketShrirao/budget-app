import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./features/transactionSlice";
import summaryReducer from "./features/summarySlice";

export const store = configureStore({
  reducer: {
    summary: summaryReducer,
    transactions: transactionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
