
import { Component, ChangeDetectionStrategy, inject, computed, signal, effect, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product, ProductReview } from '../../models/product.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CurrencyPipe, NgOptimizedImage, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  storeService = inject(StoreService);

  @ViewChild('zoomImage') zoomImage!: ElementRef<HTMLImageElement>;

  product = toSignal<Product | undefined>(
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        const product = this.storeService.getProductById(id);
        if (!product) {
          this.router.navigate(['/']);
        }
        return Promise.resolve(product);
      })
    )
  );
  
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
    });

    this.reviewForm = new FormGroup({
      user: new FormControl('', Validators.required),
      rating: new FormControl(0, [Validators.required, Validators.min(1)]),
      comment: new FormControl('', Validators.required),
    });
  }

  isTruncationNeeded = computed(() => {
    const p = this.product();
    if (!p || p.longDescription.length <= p.shortDescription.length) return false;
    const words = p.longDescription.split(/\s+/);
    return words.length > this.TRUNCATE_WORD_COUNT;
  });

  truncatedLongDescription = computed(() => {
    const p = this.product();
    if (!p) return '';
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

  quantityInCart = computed(() => {
    const p = this.product();
    if (!p || !this.areAllVariantsSelected()) return 0;
    
    const cartItemId = this.getCartItemIdForCurrentSelection();
    if (!cartItemId) return 0;

    return this.storeService.cartItems().find(item => item.cartItemId === cartItemId)?.quantity ?? 0;
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
     return this.storeService.getCartItemId(p.id, this.selectedVariants());
  }

  onAddToCart() {
    const p = this.product();
    if (p && this.areAllVariantsSelected()) {
      this.storeService.addToCart(p, this.selectedVariants());
    }
  }

  increment() {
    const cartItemId = this.getCartItemIdForCurrentSelection();
    if (cartItemId) {
      this.storeService.updateQuantity(cartItemId, 1);
    }
  }
  
  decrement() {
    const cartItemId = this.getCartItemIdForCurrentSelection();
    if (cartItemId) {
      this.storeService.updateQuantity(cartItemId, -1);
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
      this.storeService.addProductReview(p.id, this.reviewForm.value);
      this.reviewForm.reset();
      this.selectedRating.set(0);
      this.reviewForm.controls['rating'].setValue(0);
    }
  }

  handleMouseMove(event: MouseEvent) {
    const imgEl = this.zoomImage.nativeElement;
    const { left, top, width, height } = imgEl.parentElement!.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    this.renderer.setStyle(imgEl, 'transform-origin', `${x}% ${y}%`);
  }
  
  getStarArray(rating: number): any[] { return Array(rating); }
  getEmptyStarArray(rating: number): any[] { return Array(5 - rating); }
}