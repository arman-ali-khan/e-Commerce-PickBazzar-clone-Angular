
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryNavComponent {
    storeService = inject(StoreService);
    categories = this.storeService.getCategories();
}
