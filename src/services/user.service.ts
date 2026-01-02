import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Cancelled';
  total: number;
  items: { name: string; quantity: number }[];
}

export interface PaymentMethod {
  type: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
}

export interface Notification {
  id: number;
  type: 'order' | 'promotion' | 'account';
  message: string;
  date: string;
  read: boolean;
}

export interface Address {
  id: number;
  type: 'Home' | 'Office';
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo = signal<User>({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5'
  });

  orders = signal<Order[]>([
    { id: 'PB-12345', date: '2024-05-20', status: 'Delivered', total: 45.75, items: [{name: 'Organic Bananas', quantity: 2}, {name: 'Whole Milk', quantity: 1}] },
    { id: 'PB-12389', date: '2024-05-28', status: 'Processing', total: 82.50, items: [{name: 'Artisan Sourdough Bread', quantity: 1}, {name: 'Olive Oil', quantity: 1}, {name: 'Cheddar Cheese Block', quantity: 2}] },
    { id: 'PB-11987', date: '2024-04-15', status: 'Cancelled', total: 22.10, items: [{name: 'Fresh Strawberries', quantity: 3}] },
  ]);

  paymentMethods = signal<PaymentMethod[]>([
    { type: 'Visa', last4: '4242', expiry: '12/26' },
    { type: 'Mastercard', last4: '5555', expiry: '08/25' },
  ]);

  notifications = signal<Notification[]>([
    { id: 1, type: 'order', message: 'Your order #PB-12389 is now processing.', date: '2024-05-28', read: false },
    { id: 2, type: 'promotion', message: 'Get 15% off on all bakery items this weekend!', date: '2024-05-26', read: false },
    { id: 3, type: 'order', message: 'Your order #PB-12345 has been delivered.', date: '2024-05-21', read: true },
    { id: 4, type: 'account', message: 'Your password was successfully updated.', date: '2024-05-10', read: true },
  ]);

  addresses = signal<Address[]>([
    { id: 1, type: 'Home', street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'USA' },
    { id: 2, type: 'Office', street: '456 Business Rd', city: 'Workville', state: 'NY', zip: '67890', country: 'USA' },
  ]);

  private nextAddressId = 3;

  constructor() { }

  updateUserInfo(updatedInfo: Partial<User>) {
    this.userInfo.update(currentInfo => ({ ...currentInfo, ...updatedInfo }));
  }

  markNotificationAsRead(notificationId: number) {
    this.notifications.update(notifications => 
      notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }

  addAddress(address: Omit<Address, 'id'>) {
    const newAddress: Address = { ...address, id: this.nextAddressId++ };
    this.addresses.update(addresses => [...addresses, newAddress]);
  }

  updateAddress(updatedAddress: Address) {
    this.addresses.update(addresses =>
      addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr)
    );
  }

  deleteAddress(addressId: number) {
    this.addresses.update(addresses => addresses.filter(addr => addr.id !== addressId));
  }
}