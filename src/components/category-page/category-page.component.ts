import { Component, ChangeDetectionStrategy, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { AppStoreService } from '../../store/app-store.service';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  imports: [ProductGridComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(AppStoreService);
  private routeSub: Subscription;

  categoryName = signal('');
  products = signal<Product[]>([]);
  
  constructor() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const name = params.get('name');
      if (name) {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        this.categoryName.set(capitalizedName);
        this.products.set(this.store.getProductsByCategory(capitalizedName));
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}