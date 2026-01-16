import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { StoreComponent } from './components/store/store.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardProfileComponent } from './components/dashboard/profile/profile.component';
import { DashboardOrdersComponent } from './components/dashboard/orders/orders.component';
import { DashboardPaymentsComponent } from './components/dashboard/payments/payments.component';
import { DashboardCartComponent } from './components/dashboard/cart/cart.component';
import { DashboardNotificationsComponent } from './components/dashboard/notifications/notifications.component';
import { DashboardAddressesComponent } from './components/dashboard/addresses/addresses.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { authGuard } from './guards/auth.guard';
import { AdminLoginComponent } from './components/admin/login/admin-login.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin/dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/orders/admin-orders.component';
import { AdminCategoriesComponent } from './components/admin/categories/admin-categories.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'store', component: StoreComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'category/:name', component: CategoryPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: DashboardProfileComponent },
      { path: 'orders', component: DashboardOrdersComponent },
      { path: 'payments', component: DashboardPaymentsComponent },
      { path: 'cart', component: DashboardCartComponent },
      { path: 'notifications', component: DashboardNotificationsComponent },
      { path: 'addresses', component: DashboardAddressesComponent },
    ]
  },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'categories', component: AdminCategoriesComponent },
    ]
  },
  { path: '**', redirectTo: '' } // Wildcard route for a 404 or redirect
];