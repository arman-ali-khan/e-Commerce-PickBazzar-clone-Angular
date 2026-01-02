import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  userService = inject(UserService);
  router = inject(Router);

  user = this.userService.userInfo;
  isSidebarOpen = signal(false);

  logout() {
    // Mock logout logic
    alert('You have been logged out.');
    this.router.navigate(['/']);
  }
  
  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}