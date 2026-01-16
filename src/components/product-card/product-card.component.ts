import { Component, ChangeDetectionStrategy, input, inject, computed, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product.model';
import { AppStoreService } from '../../store/app-store.service';
import * as StoreActions from '../../store/actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<Product>();
  store = inject(AppStoreService);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

  @ViewChild('productImage') productImage!: ElementRef<HTMLImageElement>;

  isInWishlist = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.store.wishlist().includes(p.id);
  });

  quantityInCart = computed(() => {
    const p = this.product();
    // For products with variants, the card can't know which variant is in the cart,
    // so we don't show the quantity stepper from the grid view.
    if (!p || (p.variants && p.variants.length > 0)) {
      return 0;
    }
    const cartItemId = String(p.id); // For non-variant products, cartItemId is the stringified id
    return this.store.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
  });

  toggleWishlist() {
    const p = this.product();
    if (p) {
      this.store.dispatch(StoreActions.toggleWishlist(p.id));
    }
  }

  onAddToCart() {
    const p = this.product();
    if (!p) return;

    // If the product has variants, open the quick view instead of adding directly to cart.
    if (p.variants && p.variants.length > 0) {
      this.onQuickView();
      return;
    }

    const isFirstItem = this.store.cartCount() === 0;
    this.store.dispatch(StoreActions.addToCart(p));
    
    // Defer animation to next render cycle if the floating button needs to appear
    if (isFirstItem) {
      setTimeout(() => this.flyToCart(), 0);
    } else {
      this.flyToCart();
    }
  }

  onQuickView() {
    this.store.dispatch(StoreActions.openQuickView(this.product()));
  }
  
  increment() {
    const cartItemId = String(this.product().id);
    this.store.dispatch(StoreActions.updateQuantity(cartItemId, 1));
  }
  
  decrement() {
    const cartItemId = String(this.product().id);
    this.store.dispatch(StoreActions.updateQuantity(cartItemId, -1));
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