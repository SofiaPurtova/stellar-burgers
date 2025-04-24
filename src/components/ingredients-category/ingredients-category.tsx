import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector, useDispatch } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const dispatch = useDispatch;
  /** TODO: взять переменную из стора 
  const burgerConstructor = {
    bun: {
      _id: ''
    },
    ingredients: []
  };*/
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  const ingredientsCounters = useMemo(
    () => {
      const counters: Record<string, number> = {};
      // Считаем начинки
      constructorIngredients.forEach((ingredient: TIngredient) => {
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      });
      // Считаем булку (всегда 2)
      if (bun) {
        counters[bun._id] = 2;
      }
      return counters;
    },
    [bun, constructorIngredients]
    /*const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]*/
  );

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
