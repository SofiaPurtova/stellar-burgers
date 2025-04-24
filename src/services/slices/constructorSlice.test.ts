import { constructorReducer, initialState } from './constructorSlice';
import {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './constructorSlice';
import { TIngredient } from '@utils-types';

// Тестовые данные
const mockBun: TIngredient = {
  _id: '60d3b41abdacab0026a733c6',
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

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0940',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
};

describe('constructorSlice', () => {
  it('should return initial state', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('should add bun', () => {
      const action = {
        type: addIngredient.type,
        payload: { ...mockBun, id: 'test-bun-id' }
      };
      const state = constructorReducer(initialState, action);
      expect(state.bun).toEqual({ ...mockBun, id: 'test-bun-id' });
    });

    it('should add main ingredient', () => {
      const action = {
        type: addIngredient.type,
        payload: { ...mockMain, id: 'test-main-id' }
      };
      const state = constructorReducer(initialState, action);
      expect(state.ingredients).toEqual([{ ...mockMain, id: 'test-main-id' }]);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'to-keep' },
          { ...mockMain, id: 'to-remove' }
        ]
      };

      const action = {
        type: removeIngredient.type,
        payload: 'to-remove'
      };

      const state = constructorReducer(initialStateWithIngredients, action);
      expect(state.ingredients).toEqual([{ ...mockMain, id: 'to-keep' }]);
    });
  });

  describe('moveIngredientUp', () => {
    it('should move ingredient up', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'first', _id: '1' },
          { ...mockMain, id: 'second', _id: '2' }
        ]
      };

      const action = {
        type: moveIngredientUp.type,
        payload: 1
      };

      const state = constructorReducer(initialStateWithIngredients, action);
      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('1');
    });

    it('should not move first ingredient up', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [{ ...mockMain, id: 'first', _id: '1' }]
      };

      const action = {
        type: moveIngredientUp.type,
        payload: 0
      };

      const state = constructorReducer(initialStateWithIngredients, action);
      expect(state.ingredients[0]._id).toBe('1');
    });
  });

  describe('moveIngredientDown', () => {
    it('should move ingredient down', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'first', _id: '1' },
          { ...mockMain, id: 'second', _id: '2' }
        ]
      };

      const action = {
        type: moveIngredientDown.type,
        payload: 0
      };

      const state = constructorReducer(initialStateWithIngredients, action);
      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('1');
    });

    it('should not move last ingredient down', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [{ ...mockMain, id: 'first', _id: '1' }]
      };

      const action = {
        type: moveIngredientDown.type,
        payload: 0
      };

      const state = constructorReducer(initialStateWithIngredients, action);
      expect(state.ingredients[0]._id).toBe('1');
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      const initialStateWithData = {
        bun: mockBun,
        ingredients: [{ ...mockMain, id: 'test-id' }]
      };

      const action = {
        type: clearConstructor.type
      };

      const state = constructorReducer(initialStateWithData, action);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
