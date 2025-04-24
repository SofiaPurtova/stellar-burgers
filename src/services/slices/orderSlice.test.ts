import { orderReducer, initialState } from './orderSlice';
import {
  createOrder,
  getOrders,
  getOrderByNumber,
  fetchUserOrders,
  resetOrder,
  clearCurrentOrder
} from './orderSlice';
import { TOrder } from '../../utils/types';

// Мокируем API модуль
jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

// Тестовые данные
const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2023-04-05T10:00:00.000Z',
  updatedAt: '2023-04-05T10:00:30.000Z',
  number: 12345
};

describe('orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('should handle resetOrder', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder
      };
      const action = resetOrder();
      const state = orderReducer(stateWithOrder, action);
      expect(state.orderModalData).toBeNull();
    });

    it('should handle clearCurrentOrder', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
      };
      const action = clearCurrentOrder();
      const state = orderReducer(stateWithOrder, action);
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('createOrder thunk', () => {
    it('should handle createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: true,
        error: null
      });
    });

    it('should handle createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        orderModalData: mockOrder
      });
    });

    it('should handle createOrder.rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orderRequest: false,
        error: errorMessage
      });
    });
  });

  describe('getOrders thunk', () => {
    it('should handle getOrders.pending', () => {
      const action = { type: getOrders.pending.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle getOrders.fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orders: [mockOrder],
        isLoading: false
      });
    });

    it('should handle getOrders.rejected', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: getOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('getOrderByNumber thunk', () => {
    it('should handle getOrderByNumber.pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle getOrderByNumber.fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        currentOrder: mockOrder
      });
    });

    it('should handle getOrderByNumber.rejected', () => {
      const errorMessage = 'Failed to fetch order';
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchUserOrders thunk', () => {
    it('should handle fetchUserOrders.fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = orderReducer(initialState, action);
      expect(state.orders).toEqual([mockOrder]);
    });
  });

  describe('thunk integration', () => {
    it('createOrder dispatches correct actions', async () => {
      const { orderBurgerApi } = require('../../utils/burger-api');
      orderBurgerApi.mockResolvedValue({ order: mockOrder });

      const dispatch = jest.fn();
      const getState = jest.fn();

      await createOrder(['ing1', 'ing2'])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: createOrder.pending.type })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: createOrder.fulfilled.type,
          payload: mockOrder
        })
      );
    });

    it('getOrderByNumber dispatches correct actions', async () => {
      const { getOrderByNumberApi } = require('../../utils/burger-api');
      getOrderByNumberApi.mockResolvedValue({ orders: [mockOrder] });

      const dispatch = jest.fn();
      const getState = jest.fn();

      await getOrderByNumber(12345)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: getOrderByNumber.pending.type })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getOrderByNumber.fulfilled.type,
          payload: mockOrder
        })
      );
    });
  });
});
