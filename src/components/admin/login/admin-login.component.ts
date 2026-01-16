import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent {
  authService = inject(AdminAuthService);
  router = inject(Router);
  password = new FormControl('');
  error = signal('');

  login() {
    this.error.set('');
    const success = this.authService.login(this.password.value ?? '');
    if (success) {
      this.router.navigate(['/admin']);
    } else {
      this.error.set('Invalid password. Hint: admin123');
      this.password.reset();
    }
  }
}
