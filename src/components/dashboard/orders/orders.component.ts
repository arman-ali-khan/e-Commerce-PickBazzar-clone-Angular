import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-orders',
  templateUrl: './orders.component.html',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOrdersComponent {
  userService = inject(UserService);
  orders = this.userService.orders;
}