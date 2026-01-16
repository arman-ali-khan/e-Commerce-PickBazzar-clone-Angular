import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductReview } from '../models/product.model';
import { AppState, initialState } from './state';
import { AppAction } from './actions';
import { appReducer } from './reducer';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {
  private state = signal<AppState>(initialState);

  // --- Selectors (Exposing state as signals) ---
  products = computed(() => this.state().products);
  categories = computed(() => this.state().categories);
  cartItems = computed(() => this.state().cartItems);
  wishlist = computed(() => this.state().wishlist);
  isCartOpen = computed(() => this.state().isCartOpen);
  quickViewProduct = computed(() => this.state().quickViewProduct);
  shippingDetails = computed(() => this.state().shippingDetails);
  lastSuccessfulOrder = computed(() => this.state().lastSuccessfulOrder);

  // --- Computed Selectors (Derived state) ---
  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  wishlistCount = computed(() => this.wishlist().length);

  // --- Dispatcher ---
  dispatch(action: AppAction): void {
    this.state.set(appReducer(this.state(), action));
  }
  
  // --- Methods for accessing product data (Selectors with arguments) ---
  getAllProducts(): Product[] {
    return [...this.state().products];
  }

  getFeaturedProducts(): Product[] {
    return this.state().products.slice(0, 8);
  }
  
  getProductsByCategory(category: string): Product[] {
    return this.state().products.filter(p => p.category === category);
  }

  getProductById(id: number): Product | undefined {
    return this.state().products.find(p => p.id === id);
  }

  searchProducts(query: string): Product[] {
    if (!query) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return this.state().products.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.category.toLowerCase().includes(lowerCaseQuery));
  }

  getCategoriesWithCounts(): { name: string, count: number }[] {
    const categoryCounts: { [key: string]: number } = this.state().products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(categoryCounts).map(name => ({
        name,
        count: categoryCounts[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  getBrandsWithCounts(): { name: string; count: number }[] {
    const brandCounts: { [key: string]: number } = this.state().products.reduce((acc, product) => {
        if (product.brand) {
            acc[product.brand] = (acc[product.brand] || 0) + 1;
        }
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(brandCounts).map(name => ({
        name,
        count: brandCounts[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }
  
  getCartItemId(productId: number, selectedVariants?: { [key: string]: string }): string {
    if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
      return `${productId}`;
    }
    const variantKey = Object.keys(selectedVariants).sort().map(key => `${key}:${selectedVariants[key]}`).join('|');
    return `${productId}-${variantKey}`;
  }

  // --- Dynamic Data ---
  getCategories() {
      return this.categories();
  }

  getReviews() {
    return [
      { name: 'Alice Johnson', rating: 5, comment: 'Incredible quality and fast delivery. The fruits were so fresh!', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Ben Carter', rating: 5, comment: 'My go-to for weekly groceries. The selection is fantastic and prices are fair.', avatar: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Clara Dunne', rating: 4, comment: 'Love the organic selection. Wish they had more gluten-free bakery items, but overall great!', avatar: 'https://i.pravatar.cc/150?img=3' },
      { name: 'David Smith', rating: 5, comment: 'The customer service is top-notch. They resolved an issue with my order immediately.', avatar: 'https://i.pravatar.cc/150?img=4' }
    ];
  }
}