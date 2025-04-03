import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора 
  const orders: TOrder[] = [];*/
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, total, totalToday } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  const handleOrderClick = (order: TOrder) => {
    navigate(`/feed/${order.number}`, {
      state: { background: location }
    });
  };

  if (!orders.length) {
    return <Preloader />;
  }

  // Функция для получения номеров заказов по статусу
  //const getOrdersByStatus = (status: string): number[] => {
  //  return orders.filter((item) => item.status === status).map((item) => item.number).slice(0, 20); };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
