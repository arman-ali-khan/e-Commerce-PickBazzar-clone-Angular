import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  storeService = inject(StoreService);
  router = inject(Router);

  cartItems = this.storeService.cartItems;
  shippingDetails = this.storeService.shippingDetails;
  cartTotal = this.storeService.cartTotal;
  shippingCost = 5.00;
  
  selectedPaymentMethod = signal('bKash');

  ngOnInit() {
    // Redirect if user lands here without shipping details or an empty cart
    if (!this.shippingDetails() || this.cartItems().length === 0) {
      this.router.navigate(['/checkout']);
    }
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod.set(method);
  }

  confirmPayment() {
    // In a real app, you would process the payment here with the selected method.
    // For this demo, we'll just proceed to the success page.
    
    this.storeService.processSuccessfulOrder(this.shippingCost);
    this.router.navigate(['/order-success']);
  }

  getVariantString(item: CartItem): string {
    if (!item.selectedVariants || Object.keys(item.selectedVariants).length === 0) {
        return '';
    }
    return Object.values(item.selectedVariants).join(', ');
  }
}