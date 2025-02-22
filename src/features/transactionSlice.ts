import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase'; // Ensure supabase is imported properly


export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  important: boolean;
  recurrence: string;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

// Fetch transactions from Supabase based on user_id from localStorage
export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (_) => {
    try {
      const storedUser = localStorage.getItem('users');
      const user = storedUser ? JSON.parse(storedUser)[0] : null;

      if (!user) throw new Error('User not authenticated');

      // Fetch transactions for the authenticated user using user_id
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id); // Use the authenticated user's user_id

      if (error) throw new Error(error.message);
      return data; // Return the fetched transactions
    } catch (error) {
      throw error;
    }
  },
);

// Add a transaction to Supabase using user_id from localStorage
export const addTransactionToDB = createAsyncThunk(
  'transactions/add',
  async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const storedUser = localStorage.getItem('users');
      const user = storedUser ? JSON.parse(storedUser)[0] : null;
      if (!user) throw new Error('User not authenticated');

      // Insert the transaction with user_id
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user.id }]) // Include user_id
        .select();

      if (error) throw new Error(error.message);
      return data ? data[0] : null; // Return the inserted transaction
    } catch (error) {
      throw error;
    }
  },
);

// Remove a transaction from Supabase
export const removeTransactionFromDB = createAsyncThunk(
  'transactions/remove',
  async (id: string) => {
    try {
      const storedUser = localStorage.getItem('users');
      const user = storedUser ? JSON.parse(storedUser)[0] : null;
      if (!user) throw new Error('User not authenticated');

      // Use user_id to delete the transaction
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);
      return id;
    } catch (error) {
      throw error;
    }
  },
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions.';
      })

      // Handle adding a transaction
      .addCase(addTransactionToDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTransactionToDB.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.transactions.push(action.payload);
        }
      })
      .addCase(addTransactionToDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add transaction.';
      })

      // Handle removing a transaction
      .addCase(removeTransactionFromDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTransactionFromDB.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload,
        );
      })
      .addCase(removeTransactionFromDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove transaction.';
      });
  },
});

export default transactionSlice.reducer;
