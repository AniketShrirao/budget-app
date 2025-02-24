import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './features/transactionSlice';
import summaryReducer from './features/summarySlice';
import lendingReducer from './features/lendingSlice';

export const store = configureStore({
  reducer: {
    summary: summaryReducer,
    transactions: transactionReducer,
    lendings: lendingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
