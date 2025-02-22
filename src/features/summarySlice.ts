import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchSummary, updateSummary } from '../lib/db/summary';
import { RootState } from '../store';

interface SummaryState {
  data: Record<string, any>; // Stores summary data per month
  loading: boolean;
  error: string | null;
}

const initialState: SummaryState = {
  data: {},
  loading: false,
  error: null,
};

// **Fetch monthly summary**
export const fetchMonthlySummary = createAsyncThunk(
  'summary/fetchMonthlySummary',
  async ({ userId, month }: { userId: string; month: string }) => {
    const response = await fetchSummary(userId, month);
    return { month, summary: response };
  },
);

// **Update monthly summary**
export const updateMonthlySummary = createAsyncThunk(
  'summary/updateMonthlySummary',
  async ({
    userId,
    month,
    updatedSummary,
  }: {
    userId: string;
    month: string;
    updatedSummary: Record<string, any>;
  }) => {
    await updateSummary(userId, month, updatedSummary);
    return { month, summary: updatedSummary };
  },
);

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.month] = action.payload.summary;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch summary';
      })
      .addCase(updateMonthlySummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMonthlySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.month] = action.payload.summary;
      })
      .addCase(updateMonthlySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update summary';
      });
  },
});

export const selectSummary = (state: RootState) => state.summary.data;
export default summarySlice.reducer;
