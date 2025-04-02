// services/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'auth/checkUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      // Проверяем, что ответ содержит данные пользователя
      if (!res || !res.user) {
        throw new Error('Invalid user data received');
      }
      return res.user;
    } catch (error) {
      // Очищаем токены при ошибке
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Возвращаем понятное сообщение об ошибке
      if (error instanceof SyntaxError) {
        return rejectWithValue('Server returned invalid response');
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown authentication error'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      return res.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      return res.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

export const updateUser = createAsyncThunk(
  'auth/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(userData);
      return res.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkUserAuth.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.user = action.payload;
          state.isAuthChecked = true;
          state.isLoading = false;
        }
      )
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const authReducer = authSlice.reducer;
