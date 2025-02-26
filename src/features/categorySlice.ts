import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import { Category, CategoryFormData, CategoryType, CategoryTypeFormData } from '../types';

interface CategoryState {
  categories: Category[];
  types: CategoryType[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  types: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (userId: string) => {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return categories;
  }
);

export const fetchCategoryTypes = createAsyncThunk(
  'categories/fetchTypes',
  async (userId: string) => {
    const { data: types, error } = await supabase
      .from('category_types')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return types;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ category, userId }: { category: CategoryFormData; userId: string }) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

export const addCategoryType = createAsyncThunk(
  'categories/addType',
  async ({ type, userId }: { type: CategoryTypeFormData; userId: string }) => {
    const { data, error } = await supabase
      .from('category_types')
      .insert([{ ...type, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

export const editCategory = createAsyncThunk(
  'categories/editCategory',
  async ({ id, category, userId }: { id: string; category: CategoryFormData; userId: string }) => {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...category })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

export const editCategoryType = createAsyncThunk(
  'categories/editType',
  async ({ id, type, userId }: { id: string; type: CategoryTypeFormData; userId: string }) => {
    const { data, error } = await supabase
      .from('category_types')
      .update({ ...type })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ id, userId }: { id: string; userId: string }) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return id;
  }
);

export const deleteCategoryType = createAsyncThunk(
  'categories/deleteType',
  async ({ id, userId }: { id: string; userId: string }) => {
    const { error } = await supabase
      .from('category_types')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch categories';
        state.loading = false;
      })
      // Add similar cases for other async thunks
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(editCategoryType.fulfilled, (state, action) => {
        const index = state.types.findIndex((type: CategoryType) => type.user_id === action.payload.id);
        if (index !== -1) {
          state.types[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteCategoryType.fulfilled, (state, action) => {
        state.types = state.types.filter((type: CategoryType) => type.user_id !== action.payload);
      });
  },
});

export default categorySlice.reducer;