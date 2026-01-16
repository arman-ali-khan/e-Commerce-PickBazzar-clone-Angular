import { Component, ChangeDetectionStrategy, inject, signal, computed, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AppStoreService } from '../../store/app-store.service';
import { Product } from '../../models/product.model';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  imports: [CurrencyPipe, ProductGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreComponent implements OnDestroy {
  store = inject(AppStoreService);
  private readonly productsPerPage = 8;
  private route = inject(ActivatedRoute);
  private routeSub: Subscription;

  // Data
  allProducts = this.store.products;
  categories = this.store.getCategoriesWithCounts();
  brands = this.store.getBrandsWithCounts();
  maxPrice = signal(0);
  
  // Filter & Sort State
  selectedCategories = signal<Set<string>>(new Set());
  selectedBrands = signal<Set<string>>(new Set());
  priceRange = signal(0);
  sortBy = signal('name-asc');
  isFiltersVisible = signal(false);
  onSaleOnly = signal(false);

  // Pagination State
  currentPage = signal(1);

  filteredAndSortedProducts = computed(() => {
    let products = this.allProducts();

    // On Sale filtering
    if (this.onSaleOnly()) {
      products = products.filter(p => !!p.originalPrice);
    }
    
    // Category filtering
    const cats = this.selectedCategories();
    if (cats.size > 0) {
      products = products.filter(p => cats.has(p.category));
    }
    
    // Brand filtering
    const brands = this.selectedBrands();
    if (brands.size > 0) {
      products = products.filter(p => p.brand && brands.has(p.brand));
    }

    // Price filtering
    const price = this.priceRange();
    if (price > 0 && price < this.maxPrice()) {
      products = products.filter(p => p.price <= price);
    }
    
    // Sorting
    const sort = this.sortBy();
    return [...products].sort((a, b) => {
        switch(sort) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'name-asc':
            default:
                return a.name.localeCompare(b.name);
        }
    });
  });

  totalPages = computed(() => Math.ceil(this.filteredAndSortedProducts().length / this.productsPerPage));
  
  paginatedProducts = computed(() => {
    const products = this.filteredAndSortedProducts();
    const startIndex = (this.currentPage() - 1) * this.productsPerPage;
    return products.slice(startIndex, startIndex + this.productsPerPage);
  });
  
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pageNumbers: (number | string)[] = [];

    if (total <= 7) { // Show all pages if 7 or less
      for (let i = 1; i <= total; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (current > 3) {
        pageNumbers.push('...');
      }
      const startPage = Math.max(2, current - 1);
      const endPage = Math.min(total - 1, current + 1);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (current < total - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(total);
    }
    return pageNumbers;
  });

  constructor() {
    const products = this.store.getAllProducts();
    const max = Math.ceil(Math.max(...products.map(p => p.price)));
    this.maxPrice.set(max);
    this.priceRange.set(max);

    this.routeSub = this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.clearFilters();
        this.selectedCategories.set(new Set([category]));
      }
    });
  }
  
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  onCategoryToggle(category: string) {
    this.currentPage.set(1);
    this.selectedCategories.update(cats => {
        const newCats = new Set(cats);
        if(newCats.has(category)) {
            newCats.delete(category);
        } else {
            newCats.add(category);
        }
        return newCats;
    });
  }

  onBrandToggle(brand: string) {
    this.currentPage.set(1);
    this.selectedBrands.update(brands => {
        const newBrands = new Set(brands);
        if(newBrands.has(brand)) {
            newBrands.delete(brand);
        } else {
            newBrands.add(brand);
        }
        return newBrands;
    });
  }

  onSaleToggle() {
    this.currentPage.set(1);
    this.onSaleOnly.update(v => !v);
  }

  onPriceChange(event: Event) {
    this.currentPage.set(1);
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.priceRange.set(value);
  }

  onSortChange(event: Event) {
    this.currentPage.set(1);
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value);
  }

  clearFilters() {
    this.selectedCategories.set(new Set());
    this.selectedBrands.set(new Set());
    this.onSaleOnly.set(false);
    this.priceRange.set(this.maxPrice());
    this.currentPage.set(1);
  }

  toggleFilters() {
    this.isFiltersVisible.update(v => !v);
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
        this.currentPage.set(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    this.goToPage(Math.max(1, this.currentPage() - 1));
  }

  nextPage() {
    this.goToPage(Math.min(this.totalPages(), this.currentPage() + 1));
  }
}