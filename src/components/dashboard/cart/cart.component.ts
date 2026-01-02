import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StoreService } from '../../../services/store.service';
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
  storeService = inject(StoreService);

  cartItems = this.storeService.cartItems;
  cartTotal = this.storeService.cartTotal;
  
  removeFromCart(cartItemId: string) {
    this.storeService.removeFromCart(cartItemId);
  }

  incrementQuantity(cartItemId: string) {
    this.storeService.updateQuantity(cartItemId, 1);
  }

  decrementQuantity(cartItemId: string) {
    this.storeService.updateQuantity(cartItemId, -1);
  }

  getVariantString(item: CartItem): string {
    if (!item.selectedVariants || Object.keys(item.selectedVariants).length === 0) {
        return '';
    }
    return Object.values(item.selectedVariants).join(', ');
  }
}