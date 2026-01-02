
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  storeService = inject(StoreService);
  router = inject(Router);

  cartCount = this.storeService.cartCount;

  searchForm = new FormGroup({
    query: new FormControl('')
  });

  onSearch() {
    const query = this.searchForm.value.query;
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchForm.reset();
    }
  }

  openCart() {
    this.storeService.openCart();
  }
}
