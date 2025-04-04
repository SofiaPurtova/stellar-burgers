import { TOrder } from '@utils-types';

export type FeedUIProps = {
  orderByDate: TOrder[];
  //orders: TOrder[];
  handleGetFeeds: () => void;
  onOrderClick: (order: TOrder) => void;
};
