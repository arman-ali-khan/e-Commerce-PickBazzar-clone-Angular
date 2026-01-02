import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-payments',
  templateUrl: './payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPaymentsComponent {
  userService = inject(UserService);
  paymentMethods = this.userService.paymentMethods;

  addPaymentMethod() {
    alert('This functionality is for demonstration purposes.');
  }
}