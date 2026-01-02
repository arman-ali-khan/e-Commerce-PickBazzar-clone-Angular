import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './profile.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardProfileComponent implements OnInit {
  userService = inject(UserService);
  user = this.userService.userInfo;

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit() {
    this.profileForm.patchValue(this.user());
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.userService.updateUserInfo(this.profileForm.value);
      alert('Profile updated successfully!');
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}