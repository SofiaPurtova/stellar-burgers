import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { checkUserAuth, setAuthChecked } from '../../services/slices/authSlice';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { getCookie, deleteCookie } from '../../utils/cookie';
import React, { useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';

type ProtectedRouteProps = {
  element: React.ReactElement;
  [key: string]: any; // Разрешаем дополнительные пропсы
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;
  const from = location.state?.from || '/';
  const [currentOrder, setCurrentOrder] = useState<TOrder | null>(null);
  // Заглушка для проверки авторизации
  //const isAuth = false;
  const { isAuthChecked, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      dispatch(checkUserAuth())
        .unwrap()
        .catch((err) => {
          console.log('Ошибка проверки аутентификации:', err);
          // Очищаем токены при ошибке
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else {
      // Если токенов нет, помечаем проверку как завершенную
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const handleOrderClick = (order: TOrder) => {
    setCurrentOrder(order);
    navigate(`/profile/orders/${order.number}`, {
      state: { background: location }
    });
  };

  const ProtectedRoute = ({
    element,
    ...props
  }: {
    element: React.ReactElement;
  }) => {
    const { isAuthChecked, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (isAuthChecked && !user) {
        navigate('/login', {
          state: {
            from: location.pathname,
            background: location.state?.background
          },
          replace: true
        });
      }
    }, [isAuthChecked, user, navigate, location]);

    if (!isAuthChecked) {
      return <Preloader />;
    }

    return user ? React.cloneElement(element, props) : null;
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Основные публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Маршруты авторизации */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Защищенные маршруты профиля */}
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        {/* Маршрут для 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal onClose={() => navigate(-1)} title='Детали заказа'>
                    {currentOrder && <OrderInfo order={currentOrder} />}
                  </Modal>
                }
              />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={() => navigate(-1)} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal onClose={() => navigate(-1)} title='Детали заказа'>
                {currentOrder && <OrderInfo order={currentOrder} />}
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
