import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-addresses',
  templateUrl: './addresses.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAddressesComponent {
  userService = inject(UserService);
  fb = inject(FormBuilder);

  addresses = this.userService.addresses;
  addressForm!: FormGroup;

  isFormVisible = signal(false);
  editingAddressId = signal<number | null>(null);

  constructor() {
    this.initForm();
  }

  private initForm() {
    this.addressForm = this.fb.group({
      type: ['Home', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['USA', Validators.required],
    });
  }

  showAddForm() {
    this.editingAddressId.set(null);
    this.addressForm.reset({ type: 'Home', country: 'USA' });
    this.isFormVisible.set(true);
  }

  showEditForm(address: Address) {
    this.editingAddressId.set(address.id);
    this.addressForm.patchValue(address);
    this.isFormVisible.set(true);
  }

  hideForm() {
    this.isFormVisible.set(false);
    this.editingAddressId.set(null);
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const editingId = this.editingAddressId();
    if (editingId !== null) {
      this.userService.updateAddress({ id: editingId, ...this.addressForm.value });
    } else {
      this.userService.addAddress(this.addressForm.value);
    }
    this.hideForm();
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(id);
    }
  }
}