import { FC } from 'react';
import { AppHeaderUI } from '@ui';
//import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    navigate('/profile');
  };

  return (
    <AppHeaderUI
      userName={user?.name || ''}
      onProfileClick={handleProfileClick}
    />
  );
};
