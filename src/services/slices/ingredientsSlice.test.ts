import { ingredientsReducer, initialState } from './ingredientsSlice';
import {
  fetchIngredients,
  setCurrentIngredient,
  clearCurrentIngredient
} from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

// Мокируем API модуль
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

// Тестовые данные
const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredients: TIngredient[] = [mockIngredient];

describe('ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('should handle setCurrentIngredient', () => {
      const action = setCurrentIngredient(mockIngredient);
      const state = ingredientsReducer(initialState, action);

      expect(state.currentIngredient).toEqual(mockIngredient);
    });

    it('should handle clearCurrentIngredient', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      const action = clearCurrentIngredient();
      const state = ingredientsReducer(stateWithIngredient, action);

      expect(state.currentIngredient).toBeNull();
    });
  });

  describe('fetchIngredients thunk', () => {
    it('should handle fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    it('should handle fetchIngredients.rejected with error message', () => {
      const errorMessage = 'Failed to fetch';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchIngredients thunk integration', () => {
    it('dispatches correct actions on success', async () => {
      const { getIngredientsApi } = require('../../utils/burger-api');
      getIngredientsApi.mockResolvedValue(mockIngredients);

      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchIngredients()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: fetchIngredients.pending.type })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        })
      );
    });

    it('dispatches correct actions on failure', async () => {
      const { getIngredientsApi } = require('../../utils/burger-api');
      const errorMessage = 'Network error';
      getIngredientsApi.mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();

      await fetchIngredients()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);

      // Проверяем rejected action
      expect(dispatch.mock.calls[1][0]).toMatchObject({
        type: fetchIngredients.rejected.type,
        payload: errorMessage,
        error: {
          message: 'Rejected'
        }
      });
    });
  });
});
