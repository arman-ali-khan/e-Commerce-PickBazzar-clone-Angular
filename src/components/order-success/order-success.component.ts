import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AppStoreService } from '../../store/app-store.service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSuccessComponent implements OnInit {
  store = inject(AppStoreService);
  router = inject(Router);

  lastOrder = this.store.lastSuccessfulOrder;

  ngOnInit() {
    // Redirect if user lands here without a completed order
    if (!this.lastOrder()) {
      this.router.navigate(['/']);
    }
  }

  getVariantString(item: CartItem): string {
    if (!item.selectedVariants || Object.keys(item.selectedVariants).length === 0) {
        return '';
    }
    return Object.values(item.selectedVariants).join(', ');
  }
}