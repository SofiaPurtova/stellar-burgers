import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({
  orderByDate,
  onOrderClick
}) => (
  <div className={`${styles.content}`}>
    {orderByDate.map((order) => (
      <div key={order._id} onClick={() => onOrderClick && onOrderClick(order)}>
        <OrderCard order={order} />
      </div>
    ))}
  </div>
);
