import { Component, ChangeDetectionStrategy, input, inject, computed, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<Product>();
  storeService = inject(StoreService);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

  @ViewChild('productImage') productImage!: ElementRef<HTMLImageElement>;

  quantityInCart = computed(() => {
    const p = this.product();
    // For products with variants, the card can't know which variant is in the cart,
    // so we don't show the quantity stepper from the grid view.
    if (!p || (p.variants && p.variants.length > 0)) {
      return 0;
    }
    const cartItemId = String(p.id); // For non-variant products, cartItemId is the stringified id
    return this.storeService.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
  });

  onAddToCart() {
    const p = this.product();
    if (!p) return;

    // If the product has variants, open the quick view instead of adding directly to cart.
    if (p.variants && p.variants.length > 0) {
      this.onQuickView();
      return;
    }

    const isFirstItem = this.storeService.cartCount() === 0;
    this.storeService.addToCart(p);
    
    // Defer animation to next render cycle if the floating button needs to appear
    if (isFirstItem) {
      setTimeout(() => this.flyToCart(), 0);
    } else {
      this.flyToCart();
    }
  }

  onQuickView() {
    this.storeService.openQuickView(this.product());
  }
  
  increment() {
    const cartItemId = String(this.product().id);
    this.storeService.updateQuantity(cartItemId, 1);
  }
  
  decrement() {
    const cartItemId = String(this.product().id);
    this.storeService.updateQuantity(cartItemId, -1);
  }

  private flyToCart() {
    // Prefer the floating cart button, but fall back to the header icon
    let cartIcon = this.document.getElementById('floating-cart-icon');
    if (!cartIcon) {
        cartIcon = this.document.getElementById('header-cart-icon');
    }
    
    if (!cartIcon || !this.productImage?.nativeElement) return;

    const imgRef = this.productImage.nativeElement;
    const imgClone = imgRef.cloneNode(true) as HTMLElement;

    const imgRect = imgRef.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    this.renderer.setStyle(imgClone, 'position', 'fixed');
    this.renderer.setStyle(imgClone, 'top', `${imgRect.top}px`);
    this.renderer.setStyle(imgClone, 'left', `${imgRect.left}px`);
    this.renderer.setStyle(imgClone, 'width', `${imgRect.width}px`);
    this.renderer.setStyle(imgClone, 'height', `${imgRect.height}px`);
    this.renderer.setStyle(imgClone, 'zIndex', '9999');
    this.renderer.setStyle(imgClone, 'transition', 'all 0.6s ease-in-out');
    this.renderer.setStyle(imgClone, 'borderRadius', '50%');
    this.renderer.setStyle(imgClone, 'objectFit', 'cover');

    this.renderer.appendChild(this.document.body, imgClone);

    requestAnimationFrame(() => {
      this.renderer.setStyle(imgClone, 'top', `${cartRect.top + cartRect.height / 2}px`);
      this.renderer.setStyle(imgClone, 'left', `${cartRect.left + cartRect.width / 2}px`);
      this.renderer.setStyle(imgClone, 'width', '30px');
      this.renderer.setStyle(imgClone, 'height', '30px');
      this.renderer.setStyle(imgClone, 'opacity', '0');
    });

    setTimeout(() => {
      this.renderer.removeChild(this.document.body, imgClone);
    }, 600);
  }
}