import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from '../features/transactionSlice';
import summaryReducer from '../features/summarySlice';
import lendingReducer from '../features/lendingSlice';
import categoryReducer from '../features/categorySlice';

export const store = configureStore({
  reducer: {
    summary: summaryReducer,
    transactions: transactionReducer,
    lendings: lendingReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
