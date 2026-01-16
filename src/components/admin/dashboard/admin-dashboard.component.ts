import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AppStoreService } from '../../../store/app-store.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  store = inject(AppStoreService);
  userService = inject(UserService);

  totalProducts = computed(() => this.store.products().length);
  totalOrders = computed(() => this.userService.orders().length);
  totalRevenue = computed(() => this.userService.orders().reduce((sum, order) => sum + order.total, 0));
  lowStockCount = computed(() => this.store.products().filter(p => p.stock < 10).length);
}