import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentIngredient } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора 
  const ingredientData = null;*/
  const { currentIngredient } = useSelector((state) => state.ingredients);
  const { id } = useParams();

  const dispatch = useDispatch();
  const { ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!currentIngredient && id) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      }
    }
  }, [id, ingredients, currentIngredient, dispatch]);

  if (!currentIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={currentIngredient} />;
};
