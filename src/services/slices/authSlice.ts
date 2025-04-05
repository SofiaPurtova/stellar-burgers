// services/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  refreshToken
} from '@api';
import { TUser } from '@utils-types';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

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
      const accessToken = getCookie('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (!accessToken || !refreshToken) {
        return rejectWithValue('Токены отсутствуют');
      }
      const res = await getUserApi();
      return res.user;
    } catch (error) {
      // При ошибке 401 пробуем обновить токен
      if ((error as { message: string }).message === 'jwt expired') {
        try {
          await refreshToken();
          const res = await getUserApi();
          return res.user;
        } catch (refreshError) {
          return rejectWithValue(refreshError);
        }
      }
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi(); // API-функция для выхода
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    userData: { name?: string; email?: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateUserApi(userData);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
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
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});
export const { setAuthChecked } = authSlice.actions;

export const authReducer = authSlice.reducer;
