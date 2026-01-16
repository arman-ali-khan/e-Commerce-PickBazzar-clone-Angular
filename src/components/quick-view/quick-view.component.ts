import { Component, ChangeDetectionStrategy, inject, computed, signal, effect, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { AppStoreService } from '../../store/app-store.service';
import * as StoreActions from '../../store/actions';
import { Product } from '../../models/product.model';
import { Router, RouterLink } from '@angular/router';

declare var Swiper: any;

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickViewComponent implements OnDestroy {
  store = inject(AppStoreService);
  renderer = inject(Renderer2);
  router = inject(Router);

  product = this.store.quickViewProduct;
  selectedVariants = signal<{ [key: string]: string }>({});
  currentImage = signal<string | undefined>(undefined);

  @ViewChild('zoomImage') zoomImage!: ElementRef<HTMLImageElement>;
  @ViewChild('relatedSwiper') relatedSwiper!: ElementRef;
  swiperInstance: any;

  constructor() {
    effect(() => {
        const p = this.product();
        if (p && p.images.length > 0) {
            this.currentImage.set(p.images[0]);
        }
        this.selectedVariants.set({});
        
        // Use a timeout to allow the view to update before initializing swiper
        setTimeout(() => this.initializeSwiper(), 50);
    }, { allowSignalWrites: true });
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
    
    const cartItemId = this.store.getCartItemId(p.id, this.selectedVariants());
    return this.store.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
  });
  
  relatedProducts = computed(() => {
    const p = this.product();
    if (!p) {
      return [];
    }
    return this.store.getProductsByCategory(p.category)
      .filter(related => related.id !== p.id)
      .slice(0, 8); // Limit to 8 related products
  });

  selectVariant(variantType: string, optionName: string) {
    this.selectedVariants.update(current => ({ ...current, [variantType]: optionName }));
  }

  selectImage(imageUrl: string) {
    this.currentImage.set(imageUrl);
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.zoomImage?.nativeElement?.parentElement) return;
    const imgEl = this.zoomImage.nativeElement;
    const { left, top, width, height } = imgEl.parentElement.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    this.renderer.setStyle(imgEl, 'transform-origin', `${x}% ${y}%`);
  }

  close() {
    this.store.dispatch(StoreActions.closeQuickView());
  }

  viewProductAndClose(productId: number) {
    this.router.navigate(['/product', productId]);
    this.close();
  }
  
  onAddToCart(p: Product) {
     if (this.areAllVariantsSelected()) {
        this.store.dispatch(StoreActions.addToCart(p, this.selectedVariants()));
     }
  }

  increment(p: Product) {
    const cartItemId = this.store.getCartItemId(p.id, this.selectedVariants());
    this.store.dispatch(StoreActions.updateQuantity(cartItemId, 1));
  }
  
  decrement(p: Product) {
    const cartItemId = this.store.getCartItemId(p.id, this.selectedVariants());
    this.store.dispatch(StoreActions.updateQuantity(cartItemId, -1));
  }

  initializeSwiper() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
    
    if (this.relatedProducts().length > 0 && this.relatedSwiper?.nativeElement) {
      this.swiperInstance = new Swiper(this.relatedSwiper.nativeElement, {
        slidesPerView: 2,
        spaceBetween: 16,
        navigation: {
          nextEl: '.swiper-button-next-related',
          prevEl: '.swiper-button-prev-related',
        },
        breakpoints: {
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }
}