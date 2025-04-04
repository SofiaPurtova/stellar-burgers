import { TOrder } from '@utils-types';

export type ProfileOrdersUIProps = {
  onOrderClick?: (order: TOrder) => void;
  orders: TOrder[];
};
