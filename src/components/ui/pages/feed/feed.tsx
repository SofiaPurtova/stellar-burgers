import { FC, memo } from 'react';
import styles from './feed.module.css';
import { OrdersListUI } from '../../orders-list';
import { FeedInfoUI } from '../../feed-info';
import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';

export const FeedUI: FC<FeedUIProps> = memo(
  ({ orderByDate, handleGetFeeds, onOrderClick }) => (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleGetFeeds}
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orderByDate} onOrderClick={onOrderClick} />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo />
        </div>
      </div>
    </main>
  )
);
