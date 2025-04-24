import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TOrderState = {
  order: TOrder | null;
  currentOrder: TOrder | null;
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  order: null,
  currentOrder: null,
  orders: [],
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

// Создание заказа
export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const res = await orderBurgerApi(ingredients);
    return res.order;
  }
);

export const getOrders = createAsyncThunk('orders/fetchAll', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  getOrdersApi
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrders: (state) => state.orders,
    selectOrderLoading: (state) => state.isLoading
  }
});

export const { resetOrder, clearCurrentOrder } = orderSlice.actions;
export const { selectCurrentOrder, selectOrders, selectOrderLoading } =
  orderSlice.selectors;
export const orderReducer = orderSlice.reducer;
export default orderSlice;
