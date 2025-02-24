import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

interface Lending {
  id: string;
  borrower: string;
  amount: number;
  date: string;
  period: string;
  reminderfrequency: string;
}

interface LendingState {
  lendings: Lending[];
  loading: boolean;
  error: string | null;
}

const initialState: LendingState = {
  lendings: [],
  loading: false,
  error: null,
};

export const fetchLendings = createAsyncThunk('lendings/fetch', async () => {
  const { data, error } = await supabase.from('lendings').select('*');
  if (error) throw new Error(error.message);
  return data;
});

export const deleteLending = createAsyncThunk('lendings/delete', async (id: string) => {
  const { error } = await supabase.from('lendings').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
});

export const updateLending = createAsyncThunk('lendings/update', async (lending: Lending) => {
  const { error } = await supabase.from('lendings').update(lending).eq('id', lending.id);
  if (error) throw new Error(error.message);
  return lending;
});

const lendingSlice = createSlice({
  name: 'lendings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLendings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLendings.fulfilled, (state, action) => {
        state.loading = false;
        state.lendings = action.payload;
      })
      .addCase(fetchLendings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lendings.';
      })
      .addCase(deleteLending.fulfilled, (state, action) => {
        state.lendings = state.lendings.filter((lending) => lending.id !== action.payload);
      })
      .addCase(updateLending.fulfilled, (state, action) => {
        const index = state.lendings.findIndex((lending) => lending.id === action.payload.id);
        if (index !== -1) {
          state.lendings[index] = action.payload;
        }
      });
  },
});

export default lendingSlice.reducer;