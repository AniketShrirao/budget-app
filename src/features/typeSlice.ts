import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { typesDB } from '../lib/db/types';
import {  TypeState } from '../types/type';
import { CacheManager } from '../utils/cache';
import { RootState } from '../store';
import { TYPES_CACHE_KEY } from '../constants';

export const fetchTypes = createAsyncThunk(
  'types/fetchTypes',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const cache = CacheManager.getInstance();
    
    // Check cache first
    const cachedTypes = cache.get(TYPES_CACHE_KEY);
    if (cachedTypes) {
      return cachedTypes;
    }

    // Only fetch if not already loading or loaded
    if (state.types.status === 'loading' || state.types.status === 'succeeded') {
      return state.types.types;
    }

    const types = await typesDB.fetchAll();
    cache.set(TYPES_CACHE_KEY, types);
    return types;
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      // Prevent multiple in-flight requests
      return state.types.status !== 'loading';
    }
  }
);

export const addType = createAsyncThunk(
  'types/addType',
  async (name: string, { rejectWithValue }) => {
    try {
      return await typesDB.add({ name });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateType = createAsyncThunk(
  'types/updateType',
  async ({ id, updates }: { id: string; updates: Partial<TypeState['types'][0]> }, { rejectWithValue }) => {
    try {
      return await typesDB.update(id, updates);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteType = createAsyncThunk(
  'types/deleteType',
  async (id: string, { rejectWithValue }) => {
    try {
      return await typesDB.delete(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const initialState: TypeState = {
  types: [],
  status: 'idle',
  error: null
};

const typeSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.types = action.payload as TypeState['types'];
      })
      .addCase(fetchTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addType.fulfilled, (state, action) => {
        state.types.push(action.payload);
      })
      .addCase(updateType.fulfilled, (state, action) => {
const index = state.types.findIndex(type => type.id === action.meta.arg.id);
        if (index !== -1) {
          state.types[index] = action.payload;
        }
      })
      .addCase(deleteType.fulfilled, (state, action) => {
        state.types = state.types.filter(type => type.id !== action.meta.arg);
      });
  }
});

export default typeSlice.reducer;