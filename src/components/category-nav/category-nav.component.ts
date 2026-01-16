import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AppStoreService } from '../../store/app-store.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryNavComponent {
    store = inject(AppStoreService);
    categories = this.store.categories;
}