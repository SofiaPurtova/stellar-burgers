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
import { checkUserAuth } from '../../services/slices/authSlice';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';

import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  // Заглушка для проверки авторизации
  //const isAuth = false;
  const { isAuthChecked, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    if (!isAuthChecked) {
      navigate('/login', { state: { from: location } });
      return null;
    }
    return element;
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
              <Modal onClose={() => navigate(-1)} title='Детали заказа'>
                <OrderInfo />
              </Modal>
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
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
