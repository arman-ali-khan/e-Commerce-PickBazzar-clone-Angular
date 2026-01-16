import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { UserService, Order } from '../../../services/user.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './admin-orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrdersComponent {
  userService = inject(UserService);
  orders = this.userService.orders;

  updateStatus(order: Order, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as Order['status'];
    // In a real app, this would dispatch an action to an order service.
    // To make the change visible in this demo, we can mutate the signal's data.
    // This is generally not recommended but works for this mock setup.
    const currentOrders = this.orders();
    const orderToUpdate = currentOrders.find(o => o.id === order.id);
    if(orderToUpdate) {
        orderToUpdate.status = newStatus;
    }
  }
}
