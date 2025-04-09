import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import orderSlice from '../../services/slices/orderSlice';
import {
  selectCurrentOrder,
  clearCurrentOrder
} from '../../services/slices/orderSlice';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';

export const OrderInfo: FC = () => {
  //const { orderModalData } = useSelector((state) => state.order);
  const { ingredients } = useSelector((state) => state.ingredients);
  //const orderData = useSelector(orderSlice.selectors.getOrderByNumberSelector);
  const id = useParams().number;
  const dispatch = useDispatch();

  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(selectCurrentOrder);

  useEffect(() => {
    if (Number(id)) {
      dispatch(getOrderByNumber(Number(id)));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, Number(id)]);

  /*if (!order) {
    console.error('Order is undefined! Check:', {
      receivedOrder: order,
      locationState: window.history.state?.usr
    });
    return <div>Ошибка: данные заказа не получены</div>;
  }*/

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
