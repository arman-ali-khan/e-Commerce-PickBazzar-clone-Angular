import { Component, ChangeDetectionStrategy, inject, computed, signal, effect, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { AppStoreService } from '../../store/app-store.service';
import * as StoreActions from '../../store/actions';
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';

declare var Swiper: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink, ReactiveFormsModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  store = inject(AppStoreService);

  @ViewChild('zoomImage') zoomImage!: ElementRef<HTMLImageElement>;
  @ViewChild('relatedSwiper') relatedSwiper!: ElementRef;
  swiperInstance: any;
  
  private productId = toSignal(this.route.params.pipe(switchMap(params => Promise.resolve(+params['id']))));
  
  product = computed(() => {
    const id = this.productId();
    if (id) {
        const p = this.store.getProductById(id);
        if (!p) {
            this.router.navigate(['/']);
            return undefined;
        }
        return p;
    }
    return undefined;
  });
  
  currentImage = signal<string | undefined>(undefined);
  isDescriptionExpanded = signal(false);
  selectedVariants = signal<{ [key: string]: string }>({});

  reviewForm: FormGroup;
  hoveredRating = signal(0);
  selectedRating = signal(0);
  
  readonly TRUNCATE_WORD_COUNT = 40;


  constructor() {
    effect(() => {
      const p = this.product();
      if (p && p.images.length > 0) {
        this.currentImage.set(p.images[0]);
      }
      this.selectedVariants.set({});
      this.isDescriptionExpanded.set(false); // Reset on product change
      
      // Re-initialize swiper when product changes
      setTimeout(() => this.initializeSwiper(), 50);
    }, { allowSignalWrites: true });

    this.reviewForm = new FormGroup({
      user: new FormControl('', Validators.required),
      rating: new FormControl(0, [Validators.required, Validators.min(1)]),
      comment: new FormControl('', Validators.required),
    });
  }

  isTruncationNeeded = computed(() => {
    const p = this.product();
    if (!p || !p.longDescription || p.longDescription.length <= p.shortDescription.length) return false;
    const words = p.longDescription.split(/\s+/);
    return words.length > this.TRUNCATE_WORD_COUNT;
  });

  truncatedLongDescription = computed(() => {
    const p = this.product();
    if (!p || !p.longDescription) return '';
    if (!this.isTruncationNeeded()) return p.longDescription;
    
    const words = p.longDescription.split(/\s+/);
    return words.slice(0, this.TRUNCATE_WORD_COUNT).join(' ') + '...';
  });

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

  isInWishlist = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.store.wishlist().includes(p.id);
  });

  quantityInCart = computed(() => {
    const p = this.product();
    if (!p || !this.areAllVariantsSelected()) return 0;
    
    const cartItemId = this.getCartItemIdForCurrentSelection();
    if (!cartItemId) return 0;

    return this.store.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
  });

  relatedProducts = computed(() => {
    const p = this.product();
    if (!p) {
      return [];
    }
    return this.store.getProductsByCategory(p.category)
      .filter(related => related.id !== p.id)
      .slice(0, 10); // Limit to 10 related products
  });

  selectImage(imageUrl: string) {
    this.currentImage.set(imageUrl);
  }

  toggleDescription() {
    this.isDescriptionExpanded.update(value => !value);
  }

  selectVariant(variantType: string, optionName: string) {
    this.selectedVariants.update(current => ({ ...current, [variantType]: optionName }));
  }
  
  private getCartItemIdForCurrentSelection(): string | null {
     const p = this.product();
     if(!p) return null;
     return this.store.getCartItemId(p.id, this.selectedVariants());
  }

  toggleWishlist() {
    const p = this.product();
    if (p) {
      this.store.dispatch(StoreActions.toggleWishlist(p.id));
    }
  }

  onAddToCart() {
    const p = this.product();
    if (p && this.areAllVariantsSelected()) {
      this.store.dispatch(StoreActions.addToCart(p, this.selectedVariants()));
    }
  }

  increment() {
    const cartItemId = this.getCartItemIdForCurrentSelection();
    if (cartItemId) {
      this.store.dispatch(StoreActions.updateQuantity(cartItemId, 1));
    }
  }
  
  decrement() {
    const cartItemId = this.getCartItemIdForCurrentSelection();
    if (cartItemId) {
      this.store.dispatch(StoreActions.updateQuantity(cartItemId, -1));
    }
  }
  
  setHoverRating(rating: number) { this.hoveredRating.set(rating); }

  setRating(rating: number) {
    this.selectedRating.set(rating);
    this.reviewForm.controls['rating'].setValue(rating);
  }

  onSubmitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const p = this.product();
    if (p) {
      this.store.dispatch(StoreActions.addProductReview(p.id, this.reviewForm.value));
      this.reviewForm.reset();
      this.selectedRating.set(0);
      this.reviewForm.controls['rating'].setValue(0);
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.zoomImage?.nativeElement?.parentElement) return;
    const imgEl = this.zoomImage.nativeElement;
    const { left, top, width, height } = imgEl.parentElement.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    this.renderer.setStyle(imgEl, 'transform-origin', `${x}% ${y}%`);
  }
  
  getStarArray(rating: number): any[] { return Array(rating); }
  getEmptyStarArray(rating: number): any[] { return Array(5 - rating); }

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
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
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