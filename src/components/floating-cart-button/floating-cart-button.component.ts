
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-floating-cart-button',
  templateUrl: './floating-cart-button.component.html',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingCartButtonComponent {
  storeService = inject(StoreService);

  cartCount = this.storeService.cartCount;
  cartTotal = this.storeService.cartTotal;

  openCart() {
    this.storeService.openCart();
  }
}
