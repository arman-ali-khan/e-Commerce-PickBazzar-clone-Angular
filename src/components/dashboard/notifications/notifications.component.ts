import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-notifications',
  templateUrl: './notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNotificationsComponent {
  userService = inject(UserService);
  notifications = this.userService.notifications;

  markAsRead(id: number) {
    this.userService.markNotificationAsRead(id);
  }
}