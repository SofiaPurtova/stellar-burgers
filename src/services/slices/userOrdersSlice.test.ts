import { userOrdersReducer, initialState } from './userOrdersSlice';
import { fetchUserOrders, clearOrders } from './userOrdersSlice';
import { TOrder } from '../../utils/types';

// Мокируем API модуль
jest.mock('../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

// Тестовые данные
const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2023-04-05T10:00:00.000Z',
    updatedAt: '2023-04-05T10:00:30.000Z',
    number: 12345
  }
];

describe('userOrdersSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const state = userOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('should handle clearOrders', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrders
      };
      const action = clearOrders();
      const state = userOrdersReducer(stateWithOrders, action);
      expect(state.orders).toEqual([]);
    });
  });

  describe('fetchUserOrders thunk', () => {
    it('should handle fetchUserOrders.pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = userOrdersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle fetchUserOrders.fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = userOrdersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orders: mockOrders,
        loading: false,
        error: null
      });
    });

    it('should handle fetchUserOrders.rejected with error message', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = userOrdersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchUserOrders thunk integration', () => {
    it('dispatches correct actions on success', async () => {
      const { getOrdersApi } = require('../../utils/burger-api');
      getOrdersApi.mockResolvedValue(mockOrders);

      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchUserOrders()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: fetchUserOrders.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchUserOrders.fulfilled.type,
          payload: mockOrders
        })
      );
    });

    it('dispatches correct actions on failure', async () => {
      const { getOrdersApi } = require('../../utils/burger-api');
      const errorMessage = 'Network error';
      const mockError = new Error(errorMessage);

      // Мокаем rejectedValue с использованием rejectWithValue
      getOrdersApi.mockRejectedValue(mockError);

      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchUserOrders()(dispatch, getState, undefined);

      // Проверяем pending action
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: fetchUserOrders.pending.type })
      );

      // Проверяем rejected action
      const rejectedAction = dispatch.mock.calls[1][0];
      expect(rejectedAction.type).toBe(fetchUserOrders.rejected.type);

      // Проверяем, что payload содержит сообщение об ошибке
      expect(rejectedAction.payload).toEqual(mockError);
    });
  });
});
