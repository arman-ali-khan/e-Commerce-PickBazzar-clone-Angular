
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { BannersComponent } from '../banners/banners.component';
import { CategoryNavComponent } from '../category-nav/category-nav.component';
import { HeroComponent } from '../hero/hero.component';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    HeroComponent,
    BannersComponent,
    CategoryNavComponent,
    ProductGridComponent,
    ReviewsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  storeService = inject(StoreService);
  featuredProducts: Product[] = [];
  groceryProducts: Product[] = [];
  bakeryProducts: Product[] = [];

  constructor() {
    this.featuredProducts = this.storeService.getFeaturedProducts();
    this.groceryProducts = this.storeService.getProductsByCategory('Grocery');
    this.bakeryProducts = this.storeService.getProductsByCategory('Bakery');
  }
}
