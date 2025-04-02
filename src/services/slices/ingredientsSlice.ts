import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  currentIngredient: TIngredient | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  currentIngredient: null,
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      console.log('API Response:', response); // Добавьте лог для отладки
      if (!response) throw new Error('Пустой ответ от сервера');
      return response;
    } catch (error) {
      console.error('Ошибка загрузки:', error); // Логируем ошибку
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка сервера'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.currentIngredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { setCurrentIngredient, clearCurrentIngredient } =
  ingredientsSlice.actions;
