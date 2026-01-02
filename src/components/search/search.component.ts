
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  imports: [ProductGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private route = inject(ActivatedRoute);
  private storeService = inject(StoreService);
  private routeSub: Subscription;

  query = signal('');
  products = signal<Product[]>([]);
  
  constructor() {
    this.routeSub = this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      this.query.set(q);
      this.products.set(this.storeService.searchProducts(q));
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
