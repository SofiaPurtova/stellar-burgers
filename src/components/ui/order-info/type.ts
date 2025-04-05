import { TIngredient, TOrder } from '@utils-types';

export type OrderInfoUIProps = {
  //order: TOrder;
  orderInfo: TOrderInfo;
};

type TOrderInfo = {
  ingredientsInfo: {
    [key: string]: TIngredient & { count: number };
  };
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
