import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private router = inject(Router);
  isLoggedIn = signal(false);

  login(password: string): boolean {
    // In a real app, this would involve an API call.
    // For this demo, we use a simple hardcoded password.
    if (password === 'admin123') {
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.router.navigate(['/admin/login']);
  }
}
