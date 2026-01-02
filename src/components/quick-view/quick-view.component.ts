
import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickViewComponent {
  storeService = inject(StoreService);

  product = this.storeService.quickViewProduct;
  selectedVariants = signal<{ [key: string]: string }>({});

  constructor() {
    effect(() => {
        // Reset variants when the quick view product changes
        this.selectedVariants.set({});
    });
  }

  areAllVariantsSelected = computed(() => {
    const p = this.product();
    if (!p || !p.variants) {
      return true;
    }
    return p.variants.every(v => !!this.selectedVariants()[v.type]);
  });
  
  currentPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    let price = p.price;
    const variants = this.selectedVariants();
    if (p.variants) {
        p.variants.forEach(variant => {
            const selectedOptionName = variants[variant.type];
            if (selectedOptionName) {
                const selectedOption = variant.options.find(opt => opt.name === selectedOptionName);
                if (selectedOption?.priceModifier) {
                    price += selectedOption.priceModifier;
                }
            }
        });
    }
    return price;
  });
  
  quantityInCart = computed(() => {
    const p = this.product();
    if (!p || !this.areAllVariantsSelected()) return 0;
    
    const cartItemId = this.storeService.getCartItemId(p.id, this.selectedVariants());
    return this.storeService.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
  });
  
  selectVariant(variantType: string, optionName: string) {
    this.selectedVariants.update(current => ({ ...current, [variantType]: optionName }));
  }

  close() {
    this.storeService.closeQuickView();
  }
  
  onAddToCart(p: Product) {
     if (this.areAllVariantsSelected()) {
        this.storeService.addToCart(p, this.selectedVariants());
     }
  }

  increment(p: Product) {
    const cartItemId = this.storeService.getCartItemId(p.id, this.selectedVariants());
    this.storeService.updateQuantity(cartItemId, 1);
  }
  
  decrement(p: Product) {
    const cartItemId = this.storeService.getCartItemId(p.id, this.selectedVariants());
    this.storeService.updateQuantity(cartItemId, -1);
  }
}