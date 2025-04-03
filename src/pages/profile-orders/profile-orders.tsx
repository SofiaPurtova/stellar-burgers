import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useSelector((state) => state.orders);

  /** TODO: взять переменную из стора
  const orders: TOrder[] = []; */

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleOrderClick = (order: TOrder) => {
    navigate(`/profile/orders/${order.number}`, {
      state: { background: location }
    });
  };

  return <ProfileOrdersUI orders={orders} />;
};
