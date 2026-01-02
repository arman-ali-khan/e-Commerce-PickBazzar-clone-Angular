import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
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
  storeService = inject(StoreService);
  router = inject(Router);

  lastOrder = this.storeService.lastSuccessfulOrder;

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