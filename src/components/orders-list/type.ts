import { TOrder } from '@utils-types';

export type OrdersListProps = {
  orders: TOrder[];
  //orderByDate: TOrder[];
  onOrderClick?: (order: TOrder) => void;
};
