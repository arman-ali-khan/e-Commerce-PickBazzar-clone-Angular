import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppStoreService } from '../../store/app-store.service';
import { ProductGridComponent } from '../product-grid/product-grid.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  imports: [ProductGridComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent {
  store = inject(AppStoreService);

  wishlistProducts = computed(() => {
    const wishlistIds = new Set(this.store.wishlist());
    return this.store.products().filter(product => wishlistIds.has(product.id));
  });
}
