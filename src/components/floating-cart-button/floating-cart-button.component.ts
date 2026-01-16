import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStoreService } from '../../store/app-store.service';
import * as StoreActions from '../../store/actions';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-floating-cart-button',
  templateUrl: './floating-cart-button.component.html',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingCartButtonComponent {
  store = inject(AppStoreService);

  cartCount = this.store.cartCount;
  cartTotal = this.store.cartTotal;

  openCart() {
    this.store.dispatch(StoreActions.openCart());
  }
}