import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onProfileClick
}) => {
  const navigate = useNavigate();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <button
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
            onClick={() => navigate('/')}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </button>
          <button
            className={`${styles.link} ${isFeedActive ? styles.link_active : ''}`}
            onClick={() => navigate('/feed')}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </button>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <button
          className={`${styles.link} ${isProfileActive ? styles.link_active : ''}`}
          onClick={() => navigate('/profile')}
        >
          <div className={styles.link_position_last} onClick={onProfileClick}>
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </div>
        </button>
      </nav>
    </header>
  );
};
