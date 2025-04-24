import { store } from './store';
import { configureStore } from '@reduxjs/toolkit';
import {
  ingredientsReducer,
  initialState as ingredientsInitialState
} from './slices/ingredientsSlice';
import {
  constructorReducer,
  initialState as constructorInitialState
} from './slices/constructorSlice';
import {
  orderReducer,
  initialState as orderInitialState
} from './slices/orderSlice';
import {
  authReducer,
  initialState as authInitialState
} from './slices/authSlice';
import {
  feedReducer,
  initialState as feedInitialState
} from './slices/feedSlice';
import {
  userOrdersReducer,
  initialState as userOrdersInitialState
} from './slices/userOrdersSlice';

jest.mock('../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('Redux store configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure store with all reducers', () => {
    const mockStore = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        order: orderReducer,
        auth: authReducer,
        feed: feedReducer,
        userOrders: userOrdersReducer
      }
    });

    expect(mockStore).toBeDefined();
  });

  it('should have correct initial state structure', () => {
    const initialState = store.getState();

    expect(initialState).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      order: orderInitialState,
      auth: authInitialState,
      feed: feedInitialState,
      orders: orderInitialState,
      userOrders: userOrdersInitialState
    });
  });

  describe('Reducer initialization', () => {
    it('should initialize ingredients reducer with correct state', () => {
      const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(ingredientsInitialState);
    });

    it('should initialize constructor reducer with correct state', () => {
      const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(constructorInitialState);
    });

    it('should initialize order reducer with correct state', () => {
      const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(orderInitialState);
    });

    it('should initialize auth reducer with correct state', () => {
      const state = authReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(authInitialState);
    });

    it('should initialize feed reducer with correct state', () => {
      const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(feedInitialState);
    });

    it('should initialize userOrders reducer with correct state', () => {
      const state = userOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(userOrdersInitialState);
    });
  });

  describe('Type definitions', () => {
    it('should have correct RootState type', () => {
      const state: ReturnType<typeof store.getState> = store.getState();
      expect(state).toBeDefined();
      expect(state).toHaveProperty('ingredients');
      expect(state).toHaveProperty('burgerConstructor');
    });

    it('should have correct AppDispatch type', () => {
      const dispatch: typeof store.dispatch = store.dispatch;
      expect(typeof dispatch).toBe('function');
    });
  });
});
