import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStoreService } from '../../../store/app-store.service';
import * as StoreActions from '../../../store/actions';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../models/cart-item.model';

@Component({
  selector: 'app-dashboard-cart',
  templateUrl: './cart.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCartComponent {
  store = inject(AppStoreService);

  cartItems = this.store.cartItems;
  cartTotal = this.store.cartTotal;
  
  removeFromCart(cartItemId: string) {
    this.store.dispatch(StoreActions.removeFromCart(cartItemId));
  }

  incrementQuantity(cartItemId: string) {
    this.store.dispatch(StoreActions.updateQuantity(cartItemId, 1));
  }

  decrementQuantity(cartItemId: string) {
    this.store.dispatch(StoreActions.updateQuantity(cartItemId, -1));
  }

  getVariantString(item: CartItem): string {
    if (!item.selectedVariants || Object.keys(item.selectedVariants).length === 0) {
        return '';
    }
    return Object.values(item.selectedVariants).join(', ');
  }
}