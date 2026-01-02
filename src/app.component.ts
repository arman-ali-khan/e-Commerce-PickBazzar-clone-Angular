
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { FloatingCartButtonComponent } from './components/floating-cart-button/floating-cart-button.component';
import { QuickViewComponent } from './components/quick-view/quick-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    FloatingCartButtonComponent,
    QuickViewComponent
  ]
})
export class AppComponent {
}
