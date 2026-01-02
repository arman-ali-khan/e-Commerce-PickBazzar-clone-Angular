
import { Product } from './product.model';

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedVariants?: { [key: string]: string };
}