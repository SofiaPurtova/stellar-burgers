import { FC, memo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';
import styles from './burger-ingredient.module.css';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { setCurrentIngredient } from '../../services/slices/ingredientsSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const handleAdd = (e?: React.MouseEvent) => {
      e?.preventDefault();
      dispatch(addIngredient(ingredient));
    };

    const handleIngredientClick = () => {
      dispatch(setCurrentIngredient(ingredient)); // Устанавливаем текущий ингредиент
    };

    return (
      <Link
        to={`/ingredients/${ingredient._id}`}
        state={{ background: location }}
        onClick={handleIngredientClick}
        className={styles.link}
      >
        <BurgerIngredientUI
          ingredient={ingredient}
          count={count}
          locationState={{ background: location }}
          handleAdd={handleAdd}
        />
      </Link>
    );
  }
);
