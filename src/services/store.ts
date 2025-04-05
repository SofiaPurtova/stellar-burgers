import { configureStore } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { orderReducer } from './slices/orderSlice';
import { authReducer } from './slices/authSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    order: orderReducer,
    auth: authReducer,
    feed: feedReducer,
    orders: orderReducer,
    userOrders: userOrdersReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();

export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
