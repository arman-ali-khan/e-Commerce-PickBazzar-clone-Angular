import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppStoreService } from '../../store/app-store.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  storeService = inject(AppStoreService);
  categories = this.storeService.getCategories();
}