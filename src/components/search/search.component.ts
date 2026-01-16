import { Component, ChangeDetectionStrategy, inject, signal, computed, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { AppStoreService } from '../../store/app-store.service';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [ProductGridComponent, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(AppStoreService);
  private routeSub: Subscription;
  private readonly productsPerPage = 8;

  // Search State
  query = signal('');
  searchedProducts = signal<Product[]>([]);

  // Filter & Sort State
  selectedCategories = signal<Set<string>>(new Set());
  selectedBrands = signal<Set<string>>(new Set());
  priceRange = signal(0);
  sortBy = signal('name-asc');
  isFiltersVisible = signal(false);
  onSaleOnly = signal(false);

  // Pagination State
  currentPage = signal(1);

  // Derived Data for Filters
  availableCategories = computed(() => {
    const products = this.searchedProducts();
    const categoryCounts: { [key: string]: number } = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(categoryCounts).map(name => ({
        name,
        count: categoryCounts[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  });

  availableBrands = computed(() => {
    const products = this.searchedProducts();
    const brandCounts: { [key: string]: number } = products.reduce((acc, product) => {
        if (product.brand) {
            acc[product.brand] = (acc[product.brand] || 0) + 1;
        }
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(brandCounts).map(name => ({
        name,
        count: brandCounts[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  });

  maxPrice = computed(() => {
    const products = this.searchedProducts();
    if (products.length === 0) return 0;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  });

  // Main Computed Logic
  filteredAndSortedProducts = computed(() => {
    let products = this.searchedProducts();

    if (this.onSaleOnly()) {
      products = products.filter(p => !!p.originalPrice);
    }
    const cats = this.selectedCategories();
    if (cats.size > 0) {
      products = products.filter(p => cats.has(p.category));
    }
    const brands = this.selectedBrands();
    if (brands.size > 0) {
      products = products.filter(p => p.brand && brands.has(p.brand));
    }
    const price = this.priceRange();
    if (price > 0 && price < this.maxPrice()) {
      products = products.filter(p => p.price <= price);
    }
    
    const sort = this.sortBy();
    return [...products].sort((a, b) => {
        switch(sort) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'name-asc': default: return a.name.localeCompare(b.name);
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

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (current > 3) pageNumbers.push('...');
      const startPage = Math.max(2, current - 1);
      const endPage = Math.min(total - 1, current + 1);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (current < total - 2) pageNumbers.push('...');
      pageNumbers.push(total);
    }
    return pageNumbers;
  });

  constructor() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      this.query.set(q);
      const results = this.store.searchProducts(q);
      this.searchedProducts.set(results);
      this.clearFilters(); // Reset filters on new search
      this.priceRange.set(this.maxPrice()); // Set price range to max of new results
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onCategoryToggle(category: string) {
    this.currentPage.set(1);
    this.selectedCategories.update(cats => {
        const newCats = new Set(cats);
        newCats.has(category) ? newCats.delete(category) : newCats.add(category);
        return newCats;
    });
  }

  onBrandToggle(brand: string) {
    this.currentPage.set(1);
    this.selectedBrands.update(brands => {
        const newBrands = new Set(brands);
        newBrands.has(brand) ? newBrands.delete(brand) : newBrands.add(brand);
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
