import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  storeService = inject(StoreService);
  router = inject(Router);

  cartItems = this.storeService.cartItems;
  cartTotal = this.storeService.cartTotal;
  shippingCost = 5.00;

  shippingForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
  });

  goToPayment() {
    if (this.shippingForm.valid) {
      this.storeService.setShippingDetails(this.shippingForm.value);
      this.router.navigate(['/payment']);
    } else {
      this.shippingForm.markAllAsTouched();
    }
  }

  getVariantString(item: CartItem): string {
    if (!item.selectedVariants || Object.keys(item.selectedVariants).length === 0) {
        return '';
    }
    return Object.values(item.selectedVariants).join(', ');
  }
}