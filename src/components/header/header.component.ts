import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppStoreService } from '../../store/app-store.service';
import * as StoreActions from '../../store/actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  store = inject(AppStoreService);
  router = inject(Router);

  cartCount = this.store.cartCount;
  wishlistCount = this.store.wishlistCount;
  isMobileMenuOpen = signal(false);

  searchForm = new FormGroup({
    query: new FormControl('')
  });

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  onSearch() {
    const query = this.searchForm.value.query;
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchForm.reset();
      this.isMobileMenuOpen.set(false);
    }
  }

  openCart() {
    this.store.dispatch(StoreActions.openCart());
  }
}