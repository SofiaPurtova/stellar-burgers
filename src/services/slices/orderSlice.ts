import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  currentOrder: TOrder | null;
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
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
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(ingredients);
      return res.order;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOrdersApi();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOrdersApi();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
