import { CartItem } from './cart-item.model';

export interface Order {
  items: CartItem[];
  shipping: any;
  subtotal: number;
  shippingCost: number;
  total: number;
}