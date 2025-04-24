import { feedReducer, initialState } from './feedSlice';
import { fetchFeed } from './feedSlice';
import { TOrder, TOrdersData } from '@utils-types';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

// Мок данных для тестов
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

const mockOrdersData: TOrdersData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('fetchFeed actions', () => {
    it('should handle fetchFeed.pending', () => {
      const action = { type: fetchFeed.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle fetchFeed.fulfilled', () => {
      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockOrdersData
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null
      });
    });

    it('should handle fetchFeed.rejected', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: fetchFeed.rejected.type,
        payload: errorMessage
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });
});
