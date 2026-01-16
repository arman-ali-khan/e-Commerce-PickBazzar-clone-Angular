import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppStoreService } from '../../../store/app-store.service';
import * as StoreActions from '../../../store/actions';

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCategoriesComponent {
  store = inject(AppStoreService);
  categories = this.store.categories;

  categoryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl('', [Validators.required, Validators.maxLength(2)])
  });

  addCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const { name, icon } = this.categoryForm.value;
    if (name && icon) {
        this.store.dispatch(StoreActions.addCategory({ name, icon }));
        this.categoryForm.reset();
    }
  }

  deleteCategory(name: string) {
    if (confirm(`Are you sure you want to delete the "${name}" category? This cannot be undone.`)) {
      this.store.dispatch(StoreActions.deleteCategory(name));
    }
  }
}