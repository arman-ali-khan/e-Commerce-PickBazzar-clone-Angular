import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { BannersComponent } from '../banners/banners.component';
import { CategoryNavComponent } from '../category-nav/category-nav.component';
import { HeroComponent } from '../hero/hero.component';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { AppStoreService } from '../../store/app-store.service';

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
  store = inject(AppStoreService);

  private allProducts = this.store.products;

  featuredProducts = computed(() => this.allProducts().slice(0, 8));
  groceryProducts = computed(() => this.allProducts().filter(p => p.category === 'Grocery'));
  bakeryProducts = computed(() => this.allProducts().filter(p => p.category === 'Bakery'));
}