import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-drawer',
  templateUrl: './cart-drawer.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawerComponent {
  storeService = inject(StoreService);
  
  isCartOpen = this.storeService.isCartOpen;
  cartItems = this.storeService.cartItems;
  cartTotal = this.storeService.cartTotal;
  cartCount = this.storeService.cartCount;

  closeCart() {
    this.storeService.closeCart();
  }
  
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