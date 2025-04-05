import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, loading } = useSelector((state) => state.userOrders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/profile/orders' } });
      return;
    }
    dispatch(fetchUserOrders());
  }, [dispatch, navigate, user]);

  if (loading) return <Preloader />;

  console.log('User orders:', orders);
  console.log('User:', user);
  console.log('Loading state:', loading);

  const handleOrderClick = (order: TOrder) => {
    navigate(`/profile/orders/${order.number}`, {
      state: {
        background: location,
        order
      }
    });
  };

  return (
    <ProfileOrdersUI orders={orders || []} onOrderClick={handleOrderClick} />
  );
};
