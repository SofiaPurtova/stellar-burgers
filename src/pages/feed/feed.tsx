import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../../components/modal';
import { OrderInfo } from '../../components/order-info';
import { Routes, Route } from 'react-router-dom';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, total, totalToday, isLoading } = useSelector(
    (state) => state.feed
  );
  //const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const selectedOrder = location.state?.order as TOrder | undefined;
  console.log('Location state:', location.state);
  console.log('Selected order:', selectedOrder);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Загрузка данных при открытии страницы
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Обработчик обновления заказов
  const handleRefresh = () => {
    console.log('Refresh button clicked'); // Добавьте для отладки
    dispatch(fetchFeed());
  };

  // Обработчик клика по заказу
  const handleOrderClick = (order: TOrder) => {
    //setSelectedOrder(order);

    navigate(`/feed/${order.number}`, {
      state: {
        background: location,
        order // Передаем весь объект заказа
      },
      replace: true // Чтобы не копились записи в истории
    });
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    navigate('/feed');
  };

  if (!orders.length) {
    return <Preloader />;
  }

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI
        orderByDate={[...orders].reverse()}
        handleGetFeeds={handleRefresh}
        onOrderClick={handleOrderClick}
      />

      {location.state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={handleCloseModal}
                title={`#${selectedOrder?.number}`}
              >
                {selectedOrder ? (
                  <OrderInfo order={selectedOrder} />
                ) : (
                  <Preloader />
                )}
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
